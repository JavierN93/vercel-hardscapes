import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ContractorService } from './contractor.service';
import { UsersService } from '../users/users.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { UpdateContractorProfileDto } from './dtos/update-contractor-profile.dto';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { SlackService } from '../slack/slack.service';
import { User } from '../users/entities/user.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/models/success-response';
import { ApproveReputationDto } from './dtos/approve-reputation.dto';
import { SignLegalTermDto } from './dtos/sign-legal-term.dto';
import { LegalTermType } from './enums';
import { QueryContractorDto } from './dtos/query-contractor.dto';
import { ContractorUserDto } from './dtos/contractor-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { SetupPaymentDto } from './dtos/setup-payment.dto';
import { ExternalContactRequestDto } from '../lead/dtos/external-contact-request.dto';
import { ContractorStatus } from '../users/enums';
import { projectDefaultTakeCount } from '../common/constants/general.constants';
import { UserRole } from '../common/enums/user-role.enum';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';
import { getFromDto } from '../common/utils/repository.util';
import { HardscapeCrew } from '../users/entities/hardscape-crew.entity';

@ApiTags('Contractor')
@Controller('api')
export class ContractorController {
  constructor(
    private contractorService: ContractorService,
    private userService: UsersService,
    private portfolioService: PortfolioService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private slackService: SlackService,
  ) {
  }

  @Get('contractors')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @ApiOkResponse({ type: () => ContractorUserDto, isArray: true })
  async getContractors(@Query() query: QueryContractorDto): Promise<PaginatorDto<ContractorUserDto>> {
    const [contractors, count] = await this.userService.findContractors(query.status, query.contractorClass, query.skip || 0, query.take || projectDefaultTakeCount);
    return {
      data: contractors.map(contractor => ContractorUserDto.fromContractorProfile(contractor)),
      count,
    };
  }

  @Get('onboarding-contractors')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @ApiOkResponse({ type: () => ContractorUserDto, isArray: true })
  async getOnboardingContractors(@Query() query: PaginationDto): Promise<PaginatorDto<ContractorUserDto>> {
    const [contractors, count] = await this.userService.findOnboardingContractors(query.skip || 0, query.take || projectDefaultTakeCount);
    return {
      data: contractors.map(contractor => ContractorUserDto.fromContractorProfile(contractor)),
      count,
    };
  }

  @Post('contractor/setup-payment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SuccessResponse })
  async setupPayment(@Request() req, @Body() payload: SetupPaymentDto): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(req.user.id);
    if (user.contractorProfile.status !== ContractorStatus.SignedLegalTerms) {
      throw new BadRequestException('Preview step was not verified by the admin yet.');
    }
    user.contractorProfile.bankName = payload.bankName;
    user.contractorProfile.bankAccountName = payload.bankAccountName;
    user.contractorProfile.bankAccountNumber = payload.bankAccountNumber;
    user.contractorProfile.bankRoutingNumber = payload.bankRoutingNumber;
    user.contractorProfile.bankAccountAddress = payload.bankAccountAddress;
    user.contractorProfile.status = ContractorStatus.PaymentVerified;
    const admins = await this.userService.findSuperAdmins();
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    await this.notificationService.contractorSetupPaymentEvent(admins, user);
    return new SuccessResponse(true);
  }

  @Post('contractor/sign-legal-term')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SuccessResponse })
  async signLegalTerm(@Request() req, @Body() payload: SignLegalTermDto): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(req.user.id);
    if (user.contractorProfile.status !== ContractorStatus.ReputationCheckPassed) {
      throw new BadRequestException('Preview step was not verified by the admin yet.');
    }
    switch (payload.type) {
      case LegalTermType.SubContractorAgreement:
        user.contractorProfile.subContractorAgreementSignedDate = new Date();
        break;
      case LegalTermType.NDA:
        user.contractorProfile.ndaSignedDate = new Date();
        break;
      case LegalTermType.WorkingAgreement:
        user.contractorProfile.workingAgreementSignedDate = new Date();
        break;
    }
    if (user.contractorProfile.subContractorAgreementSignedDate) {
      user.contractorProfile.status = ContractorStatus.SignedLegalTerms;
      const admins = await this.userService.findSuperAdmins();
      await this.notificationService.contractorSignedLegalTermsEvent(admins, user);
    }
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    await this.emailService.sendPaymentSetupReminderEmail(user);
    return new SuccessResponse(true);
  }

  @Put('auth/contractor-profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: User })
  async updateProfile(@Request() req, @Body() payload: UpdateContractorProfileDto): Promise<User> {
    const user = await this.userService.findUserById(req.user.id);
    // update user information
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.phone = payload.phone;
    user.address = payload.address;
    user.latitude = payload.latitude;
    user.longitude = payload.longitude;

    // update portfolio
    const hardscapeCrews = await this.contractorService.addHardscapeCrews(payload.hardscapeCrews.map(hardscapeCrewDto => getFromDto<HardscapeCrew>(hardscapeCrewDto, new HardscapeCrew())));

    // update contractor profile
    user.contractorProfile = await this.contractorService.saveContractorProfile(user, hardscapeCrews, payload);
    await this.userService.updateUser(user);
    const admins = await this.userService.findSuperAdmins();
    await this.notificationService.contractorUpdatedProfileEvent(admins, user);
    admins.forEach(admin => {
      this.emailService.sendContractorUpdatedProfileEmail(admin, user);
    });
    await this.emailService.sendBasicProfileSentEmail(user.firstName, user.email);
    return this.userService.findUserById(user.id);
  }

  @Post('contractor/:id/approve-basic-profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async approveBasicProfile(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.contractorProfile.status !== ContractorStatus.UserCreated) {
      throw new BadRequestException('Please pass previous steps.');
    }
    user.contractorProfile.status = ContractorStatus.BasicProfileApproved;
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/approve-quality')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async approveQuality(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.contractorProfile.status !== ContractorStatus.BasicProfileApproved) {
      throw new BadRequestException('Please pass previous steps.');
    }
    user.contractorProfile.status = ContractorStatus.QualityCheckPassed;
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/approve-reputation')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async approveReputation(@Param('id') userId: string, @Body() body: ApproveReputationDto): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.contractorProfile.status !== ContractorStatus.QualityCheckPassed) {
      throw new BadRequestException('Please pass previous steps.');
    }
    user.contractorProfile.status = ContractorStatus.ReputationCheckPassed;
    user.contractorProfile.contractorClass = body.rate;
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    await this.emailService.sendContractorProfileApprovedEmail(user);
    await this.notificationService.adminApprovedBasicProfileEvent(user);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/bypass-stripe-setup')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async bypassStripeSetup(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    if (user.contractorProfile.status !== ContractorStatus.SignedLegalTerms) {
      throw new BadRequestException('Please pass previous steps.');
    }
    user.contractorProfile.status = ContractorStatus.PaymentVerified;
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/send-legal-terms-sign-reminder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async sendLegalTermsSignReminder(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    await this.emailService.sendLegalTermsSignReminderEmail(user);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/send-payment-setup-reminder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async sendPaymentSetup(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    await this.emailService.sendPaymentSetupReminderEmail(user);
    return new SuccessResponse(true);
  }

  @Post('contractor/:id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiParam({ name: 'id', required: true })
  async rejectContractor(@Param('id') userId: string): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(userId);
    user.contractorProfile.status = ContractorStatus.Rejected;
    await this.contractorService.updateContractorProfile(user.contractorProfile);
    await this.notificationService.adminDeclinedOnboardingContractorEvent(user);
    return new SuccessResponse(true);
  }

  @Post('partner-request')
  @ApiOkResponse({ type: SuccessResponse })
  async partnerRequest(@Body() body: ExternalContactRequestDto): Promise<SuccessResponse> {
    try {
      await this.emailService.sendReceivedPartnerApplicationEmail(body.fullName, body.email);
      await this.slackService.sendNotification(SlackMessageType.PartnerRequest, body);
    } catch (e) {
      console.log('partner request message error: ' + e);
    }
    return new SuccessResponse(true);
  }
}
