import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { Base64 } from 'js-base64';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { titleCase } from 'typeorm/util/StringUtils';

import { replaceTagsOnMailString } from '../common/utils/email.util';
import { PendingMessage } from '../chat/interfaces';
import { EmailType } from '../common/enums/email.type';
import { emailTemplate, EmailTemplateSubjects, emailText } from '../common/email/email.template';
import { resetPasswordLinkExpireHours } from '../common/constants/general.constants';
import { User } from '../users/entities/user.entity';
import { Project } from '../project/entities/project.entity';
import { convertUtcToEstString } from '../common/utils/time.util';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Estimate } from '../project/estimate/entities/estimate.entity';
import { declineReasonTexts } from '../project/estimate/data';
import { FinalProposal } from '../project/final-proposal/entities/final-proposal.entity';
import { EmailLog } from './entities/email-status.entity';
import { EmailEventDto } from './dtos/email-event.dto';
import { SendGridEmailStatusDto } from './dtos/send-grid-email-status.dto';
import { EmailEventType } from './enums';
import { MilestoneType } from '../payment/enums';
import { UserRole } from '../common/enums/user-role.enum';
import { SubContract } from '../project/sub-contract/entities/sub-contract.entity';
import { globalConfig } from '../config';
import { MessageFrom } from '../chat/enums';

@Injectable()
export class EmailService {

  static SendGridApi = 'https://api.sendgrid.com/v3';

  constructor(
    private http: HttpService,
    private sendGrid: SendGridService,
    private jwtService: JwtService,
    @InjectRepository(EmailLog) private emailStatusRepository: Repository<EmailLog>,
  ) {
  }

  findStatusesByProjectId(id: string, email?: string): Promise<EmailLog[]> {
    const whereClause = email ? 'project.id = :id and email_status.email=:email' : 'project.id = :id';
    return this.emailStatusRepository.createQueryBuilder('email_status')
      .leftJoinAndSelect('email_status.project', 'project')
      .where(whereClause, { id, email })
      .getMany();
  }

  async getEmailDetailStatus(id: string): Promise<EmailEventDto[]> {
    const emailStatus = await this.findEmailStatusById(id);
    const xMessageId = emailStatus.xMessageId;
    const authorizationHeader = `Bearer ${process.env.SENDGRID_API_KEY}`;
    try {
      const url = `${EmailService.SendGridApi}/messages`;
      const sendGridMessages = await this.http.get(url, {
        params: {
          limit: '1', // required field
          query: `(msg_id like '${xMessageId}%')`,
        },
        headers: {
          authorization: authorizationHeader,
        },
      }).pipe(map(res => res.data)).toPromise() as any;
      if (!sendGridMessages.messages || (sendGridMessages.messages && sendGridMessages.messages.length === 0)) {
        throw new BadRequestException('Unable to find the requested email events from the Send Grid service. It can be delayed for a while. Please try again later.');
      }
      // assume the first one is the email we are targetting
      const sendGridMessage = sendGridMessages.messages[0];
      const msgId = sendGridMessage.msg_id;
      const sendGridEmailStatus: SendGridEmailStatusDto = await this.http.get(`${EmailService.SendGridApi}/messages/${msgId}`, {
        headers: {
          authorization: authorizationHeader,
        },
      }).pipe(map(res => res.data)).toPromise() as any;
      return sendGridEmailStatus.events.map(event => ({
        type: EmailEventType[titleCase(event.event_name)],
        processedAt: event.processed,
        reason: event.reason,
        mailServer: event.mx_server,
      }));
    } catch (e) {
      if (e.response && e.response.status)
        if (Math.floor(e.response.status / 100) === 4) {
          throw new BadRequestException(e.response.statusText);
        }
      throw e;
    }
  }

  findEmailStatusById(id: string): Promise<EmailLog> {
    return this.emailStatusRepository.findOne(id);
  }

  async sendInvitationEmail(user: User, tempPassword: string): Promise<boolean> {
    const name = user.firstName;
    return this.sendMail(user.role === UserRole.Contractor ? EmailType.ContractorInvitation : EmailType.Invitation, user.email, {
      tempPassword,
      name,
      passwordResetLink: `${process.env.PRODUCTION_HOST}/invite/${user.id}`,
      linkExpireHours: resetPasswordLinkExpireHours,
    });
  }

  async sendReceivedPartnerApplicationEmail(name: string, recipient: string): Promise<boolean> {
    return this.sendMail(EmailType.ReceivedPartnerApplication, recipient, { name });
  }

  async sendSiteVisitRequestProposalEmail(customerName: string, date: Date, project: Project): Promise<boolean> {
    const user = project.consultant.user;
    const siteVisitDate = convertUtcToEstString(new Date(date));
    const confirmVisitLink = this.makeRedirectLink(user, `admin/projects/${project.id}/estimate`);
    const rescheduleLink = this.makeRedirectLink(user, `admin/projects/${project.id}/estimate`);
    return this.sendMail(EmailType.EstimateAccepted, user.email, {
      name: user.firstName,
      customerName,
      siteVisitDate,
      confirmVisitLink,
      rescheduleLink,
    }, project);
  }

  async sendBasicProfileSentEmail(name: string, recipient: string): Promise<boolean> {
    return this.sendMail(EmailType.BasicProfileSent, recipient, { name });
  }

  async sendContractorProfileApprovedEmail(user: User): Promise<boolean> {
    const legalTermsLink = this.makeRedirectLink(user, 'contractor/onboarding/legal');
    return this.sendMail(EmailType.ContractorProfileApproved, user.email, { name: user.firstName, legalTermsLink });
  }

  async sendPaymentSetupReminderEmail(user: User): Promise<boolean> {
    const paymentSetupLink = this.makeRedirectLink(user, 'contractor/onboarding/payment-setup');
    return this.sendMail(EmailType.PaymentSetupReminder, user.email, { name: user.firstName, paymentSetupLink });
  }

  async sendDepositMadeEmail(project: Project): Promise<boolean> {
    const consultant = project.consultant.user;
    const customer = project.user;
    const sendMessageLink = this.makeRedirectLink(consultant, `admin/inbox/cover`);
    return this.sendMail(EmailType.DepositMade, consultant.email, {
      name: consultant.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      sendMessageLink,
    }, project);
  }

  async sendMilestonePaidEmail(project: Project): Promise<boolean> {
    const { id: projectId, user: customer } = project;
    const consultant = project.consultant.user;
    const name = consultant.firstName;
    const customerName = `${customer.firstName} ${customer.lastName}`;
    const paymentLink = this.makeRedirectLink(consultant, `admin/projects/${projectId}/management`);
    return this.sendMail(EmailType.MilestonePaid, consultant.email, { name, customerName, paymentLink }, project);
  }

  async sendVerificationEmail(user: User): Promise<boolean> {
    return this.sendMail(EmailType.ConfirmRegister, user.email, {
      activateLink: `${process.env.PRODUCTION_HOST}/verify/${user.id}`,
      name: user.firstName,
    });
  }

  async sendResetPasswordEmail(user: User, resetToken: string): Promise<boolean> {
    return this.sendMail(EmailType.PasswordReset, user.email, {
      name: user.firstName,
      passwordResetLink: `${process.env.PRODUCTION_HOST}/reset-password/${resetToken}`,
      linkExpireHours: resetPasswordLinkExpireHours,
    });
  }

  async sendUnreadMessagesEmail(pendingMessage: PendingMessage): Promise<boolean> {
    const fromEmail = `${pendingMessage.chatId}@chat-reply.${process.env.MAIL_DOMAIN}`;
    let replyLink;
    if (pendingMessage.from === MessageFrom.FromCustomer || pendingMessage.from === MessageFrom.FromContractor) {
      replyLink = `mailto:${fromEmail}`;
    } else {
      replyLink = `mailto:${fromEmail},${globalConfig.adminJoeEmail}`;
    }
    return this.sendMail(EmailType.MessageReceived, pendingMessage.email, {
      projectName: pendingMessage.project,
      recipientName: pendingMessage.recipientName,
      senderName: pendingMessage.senderName,
      messageContent: pendingMessage.message,
      loginLink: `${process.env.PRODUCTION_HOST}/login`,
      replyLink,
    }, null, `${globalConfig.companyName} <${fromEmail}>`);
  }

  async sendConsultationEmail(user: User, project: Project): Promise<boolean> {
    const projectLink = this.makeRedirectLink(user, `app/project/${project.id}`);
    return this.sendMail(EmailType.ProjectCreated, user.email, {
      name: user.firstName,
      projectLink
    });
  }

  async sendSiteVisitScheduleChangedEmail(siteVisitSchedule: Schedule): Promise<boolean> {
    const project = siteVisitSchedule.estimate.project;
    const user = project.customer.user;
    const estimateLink = this.makeRedirectLink(user, `app/project/${siteVisitSchedule.estimate.project.id}/estimate`);
    return this.sendMail(EmailType.SiteVisitScheduleChanged, user.email, {
      name: user.firstName,
      siteVisitDate: convertUtcToEstString(new Date(siteVisitSchedule.from)),
      projectName: siteVisitSchedule.estimate.project.name,
      estimateLink,
    }, project);
  }

  async sendPickPaversScheduleChangedEmail(schedule: Schedule): Promise<boolean> {
    const project = schedule.estimate.project;
    const user = project.customer.user;
    const projectLink = this.makeRedirectLink(user, `app/project/${schedule.project.id}/management`);
    return this.sendMail(EmailType.PickPaversScheduleChanged, user.email, {
      name: user.firstName,
      scheduleDate: convertUtcToEstString(new Date(schedule.from)),
      projectName: schedule.project.name,
      projectLink,
    }, project);
  }

  async sendEmailChangedEmail(user: User, targetEmail: string, linkId: string): Promise<boolean> {
    const name = user.firstName;
    const verifyChangeEmailLink = `${process.env.PRODUCTION_HOST}/verify-email-change/${linkId}`;
    return this.sendMail(EmailType.ChangeEmail, targetEmail, {
      name,
      verifyChangeEmailLink,
    });
  }

  async sendLegalTermsSignReminderEmail(user: User): Promise<boolean> {
    const name = user.firstName;
    const legalTermsPageLink = this.makeRedirectLink(user, `contractor/onboarding/legal`);
    return this.sendMail(EmailType.LegalTermsSignReminder, user.email, {
      name,
      legalTermsPageLink,
    });
  }

  async sendEstimateReadyEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const estimateLink = this.makeRedirectLink(user, `app/project/${projectId}/estimate`);
    return this.sendMail(EmailType.EstimateReady, user.email, {
      name: user.firstName,
      estimateLink,
    }, project);
  }

  async sendEstimateUpdatedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const estimateLink = this.makeRedirectLink(user, `app/project/${projectId}/estimate`);
    return this.sendMail(EmailType.EstimateUpdated, user.email, {
      name: user.firstName,
      estimateLink,
    }, project);
  }

  async sendSiteVisitScheduledEmail(project: Project, date: Date): Promise<boolean> {
    const { user, id: projectId } = project;
    const siteVisitDate = convertUtcToEstString(new Date(date));
    const projectLink = this.makeRedirectLink(user, `app/project/${projectId}/estimate`);
    return this.sendMail(EmailType.SiteVisitScheduled, user.email, {
      name: user.firstName,
      siteVisitDate,
      projectLink,
    }, project);
  }

  async sendReceivedFinalProposalEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const finalProposalLink = this.makeRedirectLink(user, `app/project/${projectId}/proposal`);
    return this.sendMail(EmailType.ReceivedFinalProposal, user.email, {
      name: user.firstName,
      finalProposalLink,
    }, project);
  }

  async sendFinalProposalUpdatedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const finalProposalLink = this.makeRedirectLink(user, `app/project/${projectId}/proposal`);
    return this.sendMail(EmailType.FinalProposalUpdated, user.email, {
      name: user.firstName,
      finalProposalLink,
    }, project);
  }

  async sendFinalProposalAcceptedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId, consultant } = project;
    const consultantName = consultant.user.fullName;
    const projectLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.FinalProposalAccepted, user.email, {
      consultantName,
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendMilestonePaymentRequestedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const loginLink = `${process.env.PRODUCTION_HOST}/login`;
    const projectLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.MilestonePaymentRequested, user.email, {
      name: user.firstName,
      loginLink,
      projectLink,
    }, project);
  }

  async sendReceivedMilestonePaymentEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const projectLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.ReceivedMilestonePayment, user.email, {
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendReceivedMilestoneWithHoldPaymentEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const holdMilestone = project.milestones.find(m => m.order === MilestoneType.Hold);
    const projectLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    const holdAmount = holdMilestone.amount;
    return this.sendMail(EmailType.ReceivedFinalMilestoneWithHold, user.email, {
      name: user.firstName,
      projectLink,
      holdAmount,
    }, project);
  }

  async sendFinalMilestonePaymentRequestedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const loginLink = `${process.env.PRODUCTION_HOST}/login`;
    const paymentLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.FinalMilestonePaymentRequested, user.email, {
      name: user.firstName,
      loginLink,
      paymentLink,
    }, project);
  }

  async sendPickPaversScheduledEmail(project: Project): Promise<boolean> {
    const user = project.user;
    const projectLink = this.makeRedirectLink(user, `app/project/${project.id}/management`);
    return this.sendMail(EmailType.PickPaversScheduled, user.email, {
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendFinalMilestoneModifiedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const loginLink = `${process.env.PRODUCTION_HOST}/login`;
    const paymentLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.FinalMilestoneModified, user.email, {
      name: user.firstName,
      loginLink,
      paymentLink,
    }, project);
  }

  async sendDepositMilestoneUpdatedEmail(project: Project): Promise<boolean> {
    const { user, id: projectId } = project;
    const loginLink = `${process.env.PRODUCTION_HOST}/login`;
    const paymentLink = this.makeRedirectLink(user, `app/project/${projectId}/management`);
    return this.sendMail(EmailType.DepositMilestoneUpdated, user.email, {
      name: user.firstName,
      loginLink,
      paymentLink,
    }, project);
  }

  async sendTestimonialRequestEmail(project: Project): Promise<boolean> {
    const user = project.user;
    const reviewLink = process.env.GOOGLE_REVIEW_URL;
    return this.sendMail(EmailType.TestimonialRequest, user.email, {
      name: user.firstName,
      reviewLink,
    }, project);
  }

  async sendEstimateReminderEmail(user: User, project: Project): Promise<boolean> {
    const customer = project.customer.user;
    const estimateLink = this.makeRedirectLink(user, `admin/projects/${project.id}`);
    return this.sendMail(EmailType.EstimateReminder, user.email, {
      name: user.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      estimateLink,
    }, project);
  }

  async sendSiteVisitScheduleChangeRequestEmail(user: User, project: Project): Promise<boolean> {
    const customer = project.customer.user;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${project.id}/estimate`);
    return this.sendMail(EmailType.SiteVisitScheduleChangeRequest, user.email, {
      name: user.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      projectName: project.name,
      projectLink,
    }, project);
  }

  async sendEstimateDeclinedEmail(project: Project, estimate: Estimate): Promise<boolean> {
    const consultant = project.consultant.user;
    const customer = project.customer.user;
    const projectLink = this.makeRedirectLink(consultant, `admin/projects/${project.id}`);
    const reasons = estimate.declineReasons.map(reason => declineReasonTexts[reason]).join('<br>');
    return this.sendMail(EmailType.EstimateDeclined, consultant.email, {
      name: consultant.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      projectName: project.name,
      projectLink,
      reasons,
    }, project);
  }

  async sendFinalProposalDeclinedEmail(project: Project, proposal: FinalProposal): Promise<boolean> {
    const consultant = project.consultant.user;
    const customer = project.customer.user;
    const projectLink = this.makeRedirectLink(consultant, `admin/projects/${project.id}`);
    const reasons = proposal.declineReasons.map(reason => declineReasonTexts[reason]).join('<br>');
    return this.sendMail(EmailType.FinalProposalDeclined, consultant.email, {
      name: consultant.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      projectName: project.name,
      projectLink,
      reasons,
    }, project);
  }

  async sendPickPaversScheduleChangeRequestEmail(user: User, project: Project): Promise<boolean> {
    const customer = project.customer.user;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${project.id}/management`);
    return this.sendMail(EmailType.PickPaversScheduleChangeRequest, user.email, {
      name: user.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      projectName: project.name,
      projectLink,
    }, project);
  }

  async sendSiteVisitReminderForCustomerEmail(user: User, schedule: Schedule): Promise<boolean> {
    const date = schedule.from;
    const rescheduleLink = this.makeRedirectLink(user, `admin/projects/${schedule.estimate.project.id}/estimate`);
    const siteVisitDate = convertUtcToEstString(new Date(date));
    return this.sendMail(EmailType.SiteVisitReminderForCustomer, user.email, {
      name: user.firstName,
      rescheduleLink,
      siteVisitDate,
    });
  }

  async sendNewProjectEmail(user: User, project: Project): Promise<boolean> {
    const projectLink = this.makeRedirectLink(user, `admin/projects/${project.id}`);
    return this.sendMail(EmailType.NewProjectRegistered, user.email, {
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendContractSignedEmail(user: User, project: Project): Promise<boolean> {
    const { id: projectId, user: customer, name: projectName } = project;
    const contractLink = this.makeRedirectLink(user, `admin/projects/${projectId}/contract`);
    return this.sendMail(EmailType.ContractSigned, user.email, {
      name: user.firstName,
      customerName: `${customer.firstName} ${customer.lastName}`,
      projectName,
      contractLink,
    }, project);
  }

  async sendInvitedToProjectEmail(user: User, project: Project): Promise<boolean> {
    const projectId = project.id;
    const projectLink = this.makeRedirectLink(user, `contractor/projects/${projectId}/invitation`);
    return this.sendMail(EmailType.InvitedToProject, user.email, {
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendSitePlanUpdatedEmail(user: User, project: Project): Promise<boolean> {
    const projectId = project.id;
    const projectLink = this.makeRedirectLink(user, `contractor/projects/${projectId}/invitation`);
    return this.sendMail(EmailType.SitePlanUpdated, user.email, {
      name: user.firstName,
      projectLink,
    }, project);
  }

  async sendReceivedSubContractMilestonePaymentEmail(user: User, project: Project): Promise<boolean> {
    const projectId = project.id;
    const paymentLink = this.makeRedirectLink(user, `contractor/projects/${projectId}/manage-project`);
    return this.sendMail(EmailType.ReceivedSubContractMilestonePayment, user.email, {
      name: user.firstName,
      paymentLink
    });
  }

  async sendSubContractAcceptedEmail(user: User, project: Project, subContrat: SubContract, contractorUser: User): Promise<boolean> {
    const { id: projectId, name: projectName } = project;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${projectId}/sub-contract/${subContrat.id}/manage-project`);
    return this.sendMail(EmailType.SubContractAccepted, user.email, {
      name: user.firstName,
      contractorName: contractorUser.fullName,
      projectName,
      projectLink,
    });
  }

  async sendSubContractDeclinedEmail(user: User, project: Project, subContract: SubContract, contractorUser: User): Promise<boolean> {
    const { id: projectId, name: projectName } = project;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${projectId}/sub-contract/select-contractor`);
    return this.sendMail(EmailType.SubContractDeclined, user.email, {
      name: user.firstName,
      contractorName: contractorUser.fullName,
      projectName,
      projectLink,
    });
  }

  async sendContractorRequestedMilestonePaymentEmail(user: User, project: Project, subContract: SubContract, contractorUser: User): Promise<boolean> {
    const { id: projectId, name: projectName } = project;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${projectId}/sub-contract/${subContract.id}/manage-project`);
    return this.sendMail(EmailType.ContractorRequestedMilestonePayment, user.email, {
      name: user.firstName,
      contractorName: contractorUser.fullName,
      projectName,
      projectLink,
    });
  }

  async sendConsultantRequestedMilestonePaymentEmail(user: User, project: Project, subContract: SubContract, consultantUser: User): Promise<boolean> {
    const { id: projectId, name: projectName } = project;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${projectId}/sub-contract/${subContract.id}/manage-project`);
    return this.sendMail(EmailType.ConsultantRequestedMilestonePayment, user.email, {
      name: user.firstName,
      consultantName: consultantUser.fullName,
      projectName,
      projectLink,
    });
  }

  async sendSubContractCompletedEmail(user: User, project: Project, subContract: SubContract, contractorUser: User): Promise<boolean> {
    const { id: projectId, name: projectName } = project;
    const projectLink = this.makeRedirectLink(user, `admin/projects/${projectId}/sub-contract/${subContract.id}/manage-project`);
    return this.sendMail(EmailType.SubContractCompleted, user.email, {
      name: user.firstName,
      contractorName: contractorUser.fullName,
      projectName,
      projectLink,
    });
  }

  async sendContractorUpdatedProfileEmail(user: User, contractorUser: User): Promise<boolean> {
    const contractorLink = this.makeRedirectLink(user, `admin/contractors/${contractorUser.id}/basic-profile`);
    return this.sendMail(EmailType.ContractorUpdatedProfile, user.email, {
      name: user.firstName,
      contractorName: contractorUser.fullName,
      contractorLink,
    });
  }

  async sendMail(code: EmailType, recipient: string, substitutes: any, project?: Project, from?: string): Promise<boolean> {
    const subject = replaceTagsOnMailString(EmailTemplateSubjects[code], substitutes);
    const html = replaceTagsOnMailString(emailTemplate(code), substitutes);
    const text = replaceTagsOnMailString(emailText(code), substitutes);
    const clientResponse = await this.sendGrid.send({
      from: from || `${globalConfig.companyName} <support@${process.env.MAIL_DOMAIN}>`,
      to: recipient,
      subject,
      text,
      html,
    });
    if (clientResponse && clientResponse.length) {
      const headers = clientResponse[0].headers;
      const emailStatus = new EmailLog();
      emailStatus.email = recipient;
      emailStatus.type = code;
      emailStatus.xMessageId = headers['x-message-id'];
      emailStatus.project = project;
      emailStatus.subject = subject;
      this.emailStatusRepository.save(emailStatus);
    }
    return true;
  }

  private makeRedirectLink(user: User, route: string): string {
    const jwtPayload = { email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, id: user.id };
    const accessToken = this.jwtService.sign(jwtPayload);
    const payload = { accessToken, route };
    return `${process.env.PRODUCTION_HOST}/redirect/${Base64.encode(JSON.stringify(payload))}`;
  }
}
