import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PayWithCardDto } from './dtos/pay-with-card.dto';
import { ProjectService } from '../project/project.service';
import { SuccessResponse } from '../common/models/success-response';
import { NotificationService } from '../notification/notification.service';
import { UsersService } from '../users/users.service';
import { Milestone } from '../project/entities/milestone.entity';
import { VerifyPaymentDto } from './dtos/verify-payment.dto';
import { MilestoneStatus } from '../project/enums';
import { StripePaymentIntentDto } from './dtos/stripe-make-charge-result.dto';
import { PayWithAchDto } from './dtos/pay-with-ach.dto';
import { Project } from '../project/entities/project.entity';
import { EmailService } from '../email/email.service';
import { EditFinalMilestoneDto, EditMilestoneDto } from './dtos/edit-milestone.dto';
import { MilestoneType, PaymentMethod } from './enums';
import { MakeHoldDto } from './dtos/make-hold.dto';
import { Refund } from './entities/refund.entity';
import { UrlResponseDto } from '../common/dtos/url-response.dto';
import { ContractorStatus } from '../users/enums';
import { sleep } from '../common/utils/common.util';

@ApiTags('Payment')
@Controller('api/payment')
export class PaymentController {

  constructor(
    private paymentService: PaymentService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private userService: UsersService,
    private emailService: EmailService,
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':milestoneId/request-cash-pay')
  @ApiOkResponse({ type: Milestone })
  requestCashPayment(@Param('milestoneId') milestoneId: string): Promise<Milestone> {
    return this.requestPaymentConfirmation(milestoneId, PaymentMethod.Cash);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':milestoneId/request-finance-pay')
  @ApiOkResponse({ type: Milestone })
  requestFinancePayment(@Param('milestoneId') milestoneId: string): Promise<Milestone> {
    return this.requestPaymentConfirmation(milestoneId, PaymentMethod.Finance);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([])
  @Post(':milestoneId/mark-as-paid')
  @ApiOkResponse({ type: Milestone })
  async setMilestoneAsPaid(@Request() request, @Param('milestoneId') milestoneId: string): Promise<Milestone> {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(milestone.project.id);
    if (project.milestones.length === 1 && milestone.status === MilestoneStatus.Released) {
      // "continue-to-payment" case
      throw new BadRequestException('The milestone is already paid.');
    }
    if (milestone.order === MilestoneType.Start) {
      const depositMilestone = project.milestones.find(m => m.order === MilestoneType.Deposit);
      if (depositMilestone.status !== MilestoneStatus.Released) {
        throw new BadRequestException('Deposit milestone should be paid first.');
      }
    } else if (milestone.order === MilestoneType.Final) {
      const startMilestone = project.milestones.find(m => m.order === MilestoneType.Start);
      if (startMilestone && startMilestone.status !== MilestoneStatus.Released) {
        throw new BadRequestException('Start milestone should be paid first.');
      }
    }
    milestone.status = MilestoneStatus.Released;
    milestone.paidDate = new Date();
    milestone.needsConfirm = true;
    milestone.paymentMethod = PaymentMethod.Cash;
    await this.projectService.updateMilestone(milestone);
    return milestone;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Post(':projectId/make-hold')
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async makeHold(@Param('projectId') projectId: string, @Body() body: MakeHoldDto): Promise<Milestone[]> {
    const project = await this.projectService.findProjectById(projectId);
    const holdMilestone = project.milestones.find(m => m.order === MilestoneType.Hold);
    if (holdMilestone) {
      throw new BadRequestException('There is already a hold made on this project.');
    }
    const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
    finalMilestone.amount -= body.amount;
    await this.projectService.updateMilestone(finalMilestone);

    const milestone = new Milestone();
    milestone.order = MilestoneType.Hold;
    milestone.amount = body.amount;
    milestone.project = project;
    milestone.comment = body.comment;
    milestone.paymentAddOns = [];
    milestone.name = 'Hold';
    milestone.status = MilestoneStatus.Pending;
    await this.projectService.saveMilestone(milestone);
    this.emailService.sendFinalMilestoneModifiedEmail(project);
    return this.projectService.findMilestonesByProjectId(projectId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Delete('hold/:milestoneId')
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async removeHold(@Param('milestoneId') milestoneId: string): Promise<Milestone[]> {
    const holdMilestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(holdMilestone.project.id);
    const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
    finalMilestone.amount += holdMilestone.amount;
    await this.projectService.updateMilestone(finalMilestone);
    await this.projectService.removeMilestone(holdMilestone);
    return this.projectService.findMilestonesByProjectId(project.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post(':projectId/edit-cash-payment')
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => Milestone })
  async editCashPayment(@Param('projectId') projectId: string, @Body() body: EditFinalMilestoneDto): Promise<Milestone> {
    const project = await this.projectService.findProjectById(projectId);
    await this.emailService.sendFinalMilestoneModifiedEmail(project);
    return this.projectService.editPaymentAsCash(projectId, body.amount, body.comment);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Delete('add-on/:addOnId')
  @ApiImplicitParam({ name: 'addOnId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async removeAddOn(@Param('addOnId') addOnId: string): Promise<Milestone[]> {
    const addOn = await this.projectService.findAddOnById(addOnId);
    const project = await this.projectService.findProjectById(addOn.milestone.project.id);
    this.emailService.sendDepositMilestoneUpdatedEmail(project);
    return this.projectService.removeAddOn(addOn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post(':milestoneId/add-on')
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async addPaymentAddOn(@Param('milestoneId') milestoneId: string, @Body() body: EditFinalMilestoneDto): Promise<Milestone[]> {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(milestone.project.id);
    if (milestone.order === MilestoneType.Deposit) {
      const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
      finalMilestone.amount = finalMilestone.amount - body.amount;
      await this.projectService.updateMilestone(finalMilestone);
    }
    this.sendMilestoneAddOnEmail(project, milestone);
    await this.projectService.addPaymentAddOn(milestone, body.amount, body.comment);
    return this.projectService.findMilestonesByProjectId(project.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post(':milestoneId/edit-amount')
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async editAmount(@Param('milestoneId') milestoneId: string, @Body() body: EditMilestoneDto): Promise<Milestone[]> {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    if (milestone.order !== MilestoneType.Deposit) {
      throw new BadRequestException('Only the deposit milestone is allowed to be edited.');
    }
    const project = await this.projectService.findProjectById(milestone.project.id);

    const originalAmount = milestone.amount;
    const newAmount = body.amount;

    const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
    finalMilestone.amount -= newAmount - originalAmount;
    milestone.amount = newAmount;
    await this.projectService.updateMilestone(finalMilestone);
    await this.projectService.updateMilestone(milestone);

    await this.emailService.sendDepositMilestoneUpdatedEmail(project);

    return this.projectService.findMilestonesByProjectId(project.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post(':projectId/add-refund')
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => Refund })
  async addRefund(@Param('projectId') projectId: string, @Body() body: EditFinalMilestoneDto): Promise<Refund> {
    const project = await this.projectService.findProjectById(projectId);
    const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
    if (body.amount > finalMilestone.amount) {
      throw new BadRequestException('Refund amount can not be greater than the final milestone amount.');
    }
    finalMilestone.amount -= body.amount;
    await this.projectService.updateMilestone(finalMilestone);
    const refund = await this.projectService.addRefund(projectId, body.amount, body.comment);
    this.emailService.sendFinalMilestoneModifiedEmail(project);
    return refund;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Delete('refund/:refundId')
  @ApiImplicitParam({ name: 'refundId', required: true })
  @ApiOkResponse({ type: () => Milestone, isArray: true })
  async removeRefund(@Param('refundId') refundId: string): Promise<Milestone[]> {
    const refund = await this.projectService.findRefundById(refundId);
    const project = await this.projectService.findProjectById(refund.project.id);
    const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
    finalMilestone.amount += refund.amount;
    await this.projectService.updateMilestone(finalMilestone);
    project.refund = null;
    await this.projectService.saveProject(project);
    await this.projectService.removeRefund(refund);
    return this.projectService.findMilestonesByProjectId(project.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Post(':milestoneId/confirm-cash-pay')
  @ApiOkResponse({ type: Milestone })
  confirmCashPay(@Param('milestoneId') milestoneId: string): Promise<Milestone> {
    return this.confirmPayment(milestoneId, PaymentMethod.Cash);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Post(':milestoneId/confirm-finance-pay')
  @ApiOkResponse({ type: Milestone })
  confirmFinancePay(@Param('milestoneId') milestoneId: string): Promise<Milestone> {
    return this.confirmPayment(milestoneId, PaymentMethod.Finance);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post(':milestoneId/request-release')
  @ApiOkResponse({ type: Milestone })
  async requestReleaseMilestone(@Param('milestoneId') milestoneId: string): Promise<Milestone> {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(milestone.project.id);
    if (milestone.status === MilestoneStatus.Released) {
      return milestone;
    }
    await this.notificationService.consultantRequestedToReleaseMilestoneEvent(project.user, milestone);
    this.sendMilestoneRequestEmail(project, milestone);
    return this.projectService.requestReleaseMilestone(milestoneId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post('pay-with-card')
  @ApiOkResponse({ type: StripePaymentIntentDto })
  async payWithCard(@Request() request, @Body() body: PayWithCardDto): Promise<any> {
    const userId = request.user.id;
    const [stripeCustomerId, milestone] = await this.validateCustomerMilestone(userId, body.milestoneId);
    const addOnAmount = this.paymentService.addOnAmountFromMilestone(milestone);
    const milestonePayAmount = Math.round((milestone.amount + addOnAmount) * 100); // convert unit to cent
    const [paymentIntentId, paymentClientSecret] = await this.paymentService.createPaymentIntent(milestonePayAmount, stripeCustomerId);
    milestone.paymentId = paymentIntentId;
    await this.projectService.updateMilestone(milestone);
    return {
      clientSecret: paymentClientSecret,
      publishableKey: process.env.STRIPE_PK,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post('pay-with-ach')
  @ApiOkResponse({ type: Milestone })
  async payWithAch(@Request() request, @Body() body: PayWithAchDto): Promise<Milestone> {
    const userId = request.user.id;
    const [, milestone, project] = await this.validateCustomerMilestone(userId, body.milestoneId);
    const bankAccountToken = await this.paymentService.createBankAccountToken(body.plaidPublicToken, body.plaidAccountId);
    const addOnAmount = this.paymentService.addOnAmountFromMilestone(milestone);
    const amount = Math.round((milestone.amount + addOnAmount) * 100); // convert unit to cent
    await this.paymentService.makeCharge(bankAccountToken, amount, `Charge milestone ${milestone.order + 1} for Landscaping project "${project.name}"`);
    await this.projectService.setMilestonePaid(milestone, PaymentMethod.Bank);
    const admins = await this.userService.findSuperAdmins();
    const notificationRecipients = admins.find(admin => admin.id === project.consultant.user.id) ? admins : [...admins, project.consultant.user];
    await this.notificationService.customerReleasedMilestoneEvent(notificationRecipients, milestone);
    this.sendMilestonePaymentEmail(project, milestone);
    return this.projectService.findMilestoneById(milestone.id);
  }

  @Get('stripe-account-setup-page-link')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: () => UrlResponseDto })
  async getStripeAccountSetupPageLink(@Request() request): Promise<UrlResponseDto> {
    const userId = request.user.id;
    const user = await this.userService.findUserById(userId);
    if (!user.contractorProfile) {
      throw new UnauthorizedException('You don\'t need to setup stripe account for a contractor.');
    }
    let stripeAccountId = user.contractorProfile.stripeAccountId;
    if (!stripeAccountId) {
      stripeAccountId = await this.paymentService.createStripeAccount(user.email);
      user.contractorProfile.stripeAccountId = stripeAccountId;
      await this.userService.updateContractorProfile(user.contractorProfile);
    }
    const url = await this.paymentService.stripeAccountLink(stripeAccountId);
    return { url };
  }

  @Post('stripe-webhook')
  async stripeWebhook(@Headers('stripe-signature') signature: string, @Req() request: any) {
    const event = this.paymentService.createStripeEvent(signature, request.rawBody);
    const eventType = event.type;
    switch (eventType) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const milestone = await this.projectService.findMilestoneByPaymentId(paymentIntentId);
        if (!milestone) {
          return new SuccessResponse(true, 'Could not find the milestone.');
        }
        // hotfix: issue #19 - https://github.com/Jobhubgroup/hardscapes-api/issues/19
        // sleep 2 second for verify credit card payment method to be processed
        await sleep(2000);
        const paid = await this.projectService.isMilestonePaidByPaymentId(paymentIntentId);
        if (!paid) {
          const milestone = await this.projectService.setMilestonePaidByPaymentId(paymentIntentId, PaymentMethod.CreditCard);
          await this.postCreditCardPaymentSucceed(paymentIntentId, milestone);
        }
        break;
      }
      case 'account.updated': {
        const account = event.data.object;
        const validated = this.paymentService.validateStripeAccount(account);
        const accountId = account.id;
        const contractorProfile = await this.userService.findContractorByStripeAccountId(accountId);
        const userId = contractorProfile.user.id;
        if (!contractorProfile) {
          throw new BadRequestException('not a registered account.');
        }
        if (validated) {
          contractorProfile.status = ContractorStatus.PaymentVerified;
          await this.userService.updateContractorProfile(contractorProfile);
          const contractorUser = await this.userService.findUserById(userId);
          const admins = await this.userService.findSuperAdmins();
          await this.notificationService.contractorFinishedSettingUpStripeAccountEvent(admins, contractorUser);
        }
      }
    }
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post('verify')
  async verifyCreditCardPayment(@Body() payload: VerifyPaymentDto): Promise<Milestone[]> {
    let milestone = await this.projectService.findMilestoneById(payload.milestoneId);
    let paymentIntent;
    try {
      paymentIntent = await this.paymentService.retrievePayment(milestone.paymentId);
    } catch (e) {
      throw new BadRequestException('Error occurred while fetching payment intent from stripe service.');
    }
    if (!paymentIntent) {
      throw new BadRequestException('Failed to fetch payment intent from stripe service.');
    }
    if (paymentIntent.error) {
      throw new BadRequestException(paymentIntent.error.message);
    }
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Failed to proceed with payment.');
    }
    if (!milestone.paidDate) {
      milestone = await this.projectService.setMilestonePaidByPaymentId(paymentIntent.id, PaymentMethod.CreditCard);
      await this.postCreditCardPaymentSucceed(paymentIntent.id, milestone);
    }
    return this.projectService.findMilestonesByProjectId(milestone.project.id);
  }

  async postCreditCardPaymentSucceed(paymentIntentId: string, milestone: Milestone) {
    const project = await this.projectService.findProjectById(milestone.project.id);
    this.sendMilestonePaymentEmail(project, milestone);
    const admins = await this.userService.findSuperAdmins();
    const notificationRecipients = admins.find(admin => admin.id === project.consultant.user.id) ? admins : [...admins, project.consultant.user];
    await this.notificationService.customerReleasedMilestoneEvent(notificationRecipients, milestone);
  }

  private async createStripeCustomerIfNotExists(userId: string): Promise<string> {
    const user = await this.userService.findUserById(userId);
    if (!user.stripeCustomerId) {
      user.stripeCustomerId = await this.paymentService.createCustomer(`${user.firstName} ${user.lastName}`, user.email);
      await this.userService.updateUser(user);
    }
    return user.stripeCustomerId;
  }

  private async validateCustomerMilestone(userId: string, milestoneId: string): Promise<[string, Milestone, Project]> {
    const stripeCustomerId = await this.createStripeCustomerIfNotExists(userId);
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(milestone.project.id);
    if (project.customer.user.id !== userId) {
      throw new BadRequestException('You are not allowed to process the payment.');
    }

    if (milestone.paidDate) {
      throw new BadRequestException('The milestone is already paid.');
    }
    return [stripeCustomerId, milestone, project];
  }

  private sendMilestonePaymentEmail(project: Project, milestone: Milestone) {
    switch (milestone.order) {
      case MilestoneType.Deposit: {
        this.emailService.sendFinalProposalAcceptedEmail(project);
        this.emailService.sendDepositMadeEmail(project);
        break;
      }
      case MilestoneType.Start: {
        this.emailService.sendReceivedMilestonePaymentEmail(project);
        this.emailService.sendMilestonePaidEmail(project);
        break;
      }
      case MilestoneType.Final: {
        this.emailService.sendMilestonePaidEmail(project);
        const holdMilestone = project.milestones.find(m => m.order === MilestoneType.Hold);
        if (holdMilestone) {
          this.emailService.sendReceivedMilestoneWithHoldPaymentEmail(project);
        } else {
          this.emailService.sendTestimonialRequestEmail(project);
        }
        break;
      }
      case MilestoneType.Hold: {
        this.emailService.sendMilestonePaidEmail(project);
        this.emailService.sendTestimonialRequestEmail(project);
      }
    }
  }

  private sendMilestoneRequestEmail(project: Project, milestone: Milestone) {
    switch (milestone.order) {
      case MilestoneType.Start: {
        this.emailService.sendMilestonePaymentRequestedEmail(project);
        break;
      }
      case MilestoneType.Final: {
        this.emailService.sendFinalMilestonePaymentRequestedEmail(project);
        break;
      }
    }
  }

  private sendMilestoneAddOnEmail(project: Project, milestone: Milestone) {
    switch (milestone.order) {
      case MilestoneType.Deposit: {
        this.emailService.sendDepositMilestoneUpdatedEmail(project);
        break;
      }
      case MilestoneType.Start: {
        break;
      }
      case MilestoneType.Final: {
        this.emailService.sendFinalMilestoneModifiedEmail(project);
        break;
      }
    }
  }

  private async confirmPayment(milestoneId: string, paymentMethod: PaymentMethod): Promise<Milestone> {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    const project = await this.projectService.findProjectById(milestone.project.id);
    if (milestone.status === MilestoneStatus.Released) {
      return milestone;
    }
    await this.projectService.setMilestonePaid(milestone, paymentMethod);
    if (paymentMethod === PaymentMethod.Cash) {
      await this.notificationService.consultantConfirmedCashPaymentEvent(project.user, milestone);
    } else if (paymentMethod === PaymentMethod.Finance) {
      await this.notificationService.consultantConfirmedFinancePaymentEvent(project.user, milestone);
    }
    this.sendMilestonePaymentEmail(project, milestone);
    return milestone;

  }

  private async requestPaymentConfirmation(milestoneId: string, paymentMethod: PaymentMethod) {
    const milestone = await this.projectService.findMilestoneById(milestoneId);
    milestone.needsConfirm = true;
    milestone.paymentMethod = paymentMethod;
    await this.projectService.updateMilestone(milestone);
    const admins = await this.userService.findSuperAdmins();
    const project = await this.projectService.findProjectById(milestone.project.id);
    const notificationRecipients = admins.find(admin => admin.id === project.consultant.user.id) ? admins : [...admins, project.consultant.user];
    if (paymentMethod === PaymentMethod.Cash) {
      await this.notificationService.customerRequestedCashPaymentEvent(notificationRecipients, milestone);
    } else if (paymentMethod === PaymentMethod.Finance) {
      await this.notificationService.customerRequestedFinancePaymentEvent(notificationRecipients, milestone);
    }
    return milestone;
  }
}
