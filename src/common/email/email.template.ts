import { EmailType } from '../enums/email.type';
import * as Fs from 'fs';
import { globalConfig } from '../../config';

export const EmailTemplateSubjects = {
  [EmailType.ProjectCreated]: 'Thanks for telling us about your project',
  [EmailType.EstimateReady]: 'Estimate ready',
  [EmailType.EstimateUpdated]: 'Estimate updated',
  [EmailType.SiteVisitScheduled]: 'Your upcoming site visit has been scheduled!',
  [EmailType.SiteVisitReminderForCustomer]: 'Just a Reminder for our site visit tomorrow!',
  [EmailType.ReceivedFinalProposal]: 'Here is your final proposal!',
  [EmailType.FinalProposalUpdated]: 'There is an update on your final proposal!',
  [EmailType.FinalProposalAccepted]: 'Congratulations on hiring us for your hardscape project!',
  [EmailType.MilestonePaymentRequested]: 'Milestone 2 payment requested',
  [EmailType.ReceivedMilestonePayment]: 'Milestone 2 payment received',
  [EmailType.FinalMilestonePaymentRequested]: 'Final payment requested',
  [EmailType.FinalMilestoneModified]: 'Final payment request changed',
  [EmailType.ReceivedFinalMilestoneWithHold]: `Milestone 3 payment received`,
  [EmailType.TestimonialRequest]: 'Thank you for your business',
  [EmailType.ConfirmRegister]: 'Confirm your email address',
  [EmailType.NewProjectRegistered]: 'A New Project is ready for review',
  [EmailType.EstimateReminder]: `You've been requested to provide a virtual estimate on a new project`,
  [EmailType.EstimateAccepted]: `Site visit and finale proposal request`,
  [EmailType.SiteVisitReminderForConsultant]: `Your site visit with {{customerName}} is tomorrow`,
  [EmailType.FinalProposalReminder]: `Submit your final proposal`,
  [EmailType.DepositMade]: `Your proposal has been accepted`,
  [EmailType.MilestonePaid]: `You've received a new milestone payment`,
  [EmailType.MessageReceived]: `Project consultation - {{projectName}}`,
  [EmailType.PasswordReset]: `Reset password`,
  [EmailType.Invitation]: `You are invited to join {{companyName}}`,
  [EmailType.ReceivedPartnerApplication]: `Your application has been received`,
  [EmailType.ContractSigned]: `{{customerName}} has signed a contract`,
  [EmailType.SiteVisitScheduleChangeRequest]: `{{customerName}} has requested another day for site visit`,
  [EmailType.ContractReady]: `Contract is ready`,
  [EmailType.SiteVisitScheduleChanged]: `Site visit schedule has been changed!`,
  [EmailType.PickPaversScheduleChanged]: `Picking out pavers schedule has been changed!`,
  [EmailType.PickPaversScheduleChangeRequest]: `{{customerName}} has requested another day for pick pavers`,
  [EmailType.PickPaversScheduled]: `Picking out pavers scheduled`,
  [EmailType.EstimateDeclined]: `{{customerName}} has declined the estimate`,
  [EmailType.FinalProposalDeclined]: `{{customerName}} has declined the final proposal`,
  [EmailType.ChangeEmail]: `Verify your new email address`,
  [EmailType.BasicProfileSent]: `Your basic profile has been sent`,
  [EmailType.ContractorProfileApproved]: `Your application to become a Contractor has been approved`,
  [EmailType.LegalTermsSignReminder]: `Please sign all legal terms`,
  [EmailType.PaymentSetupReminder]: `Please setup payment`,
  [EmailType.DepositMilestoneUpdated]: 'Deposit updated!',
  [EmailType.InvitedToProject]: 'You are invited to a project',
  [EmailType.SitePlanUpdated]: 'Site plan updated',
  [EmailType.ReceivedSubContractMilestonePayment]: '{{companyName has released a milestone',
  [EmailType.SubContractAccepted]: '{{contractorName}} has accepted a project',
  [EmailType.SubContractDeclined]: '{{contractorName}} has declined a project',
  [EmailType.ContractorRequestedMilestonePayment]: '{{contractorName}} has requested to release a milestone',
  [EmailType.ConsultantRequestedMilestonePayment]: '{{consultantName}} has requested to release a milestone',
  [EmailType.SubContractCompleted]: '{{contractorName}} has completed a project',
  [EmailType.ContractorUpdatedProfile]: '{{contractorName}} has updated their profile',
  [EmailType.ContractorInvitation]: 'You have been invited as a Contractor candidate',
};

export const EmailTextContents = {
  // TODO: define text versions for each email types
};

export function emailTemplate(code: EmailType): string {
  const filePath = `${__dirname}/../../../templates/${code}.html`;
  if (Fs.existsSync(filePath)) {
    const html = Fs.readFileSync(filePath);
    return html.toString();
  } else {
    const unsubscribe = `<br><br>Sent from ${globalConfig.companyName}<br>` +
      `${globalConfig.companyName} ${globalConfig.companyType}, ${globalConfig.companyAddress}<br>` +
      `<a href="${process.env.UNSUBSCRIBE_LINK}">Unsubscribe</a>`;
    return `${EmailTextContents[code]}${unsubscribe}`;
  }
}

export function emailText(code: EmailType): string {
  const template = EmailTextContents[code] || '(No text version for this email)';
  const footer = 'Sent from {{companyName}}\n{{companyName}} {{companyType}}, {{companyAddress}}\nPlease use this link to unsubscribe. {{unsubscribeLink}}';
  return `${template}\n\n${footer}`;
}
