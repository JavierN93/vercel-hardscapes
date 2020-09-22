import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { SitePlan } from '../../contractor/entities/site-plan.entity';
import { SitePlanDto } from './dtos/site-plan.dto';
import { SitePlanService } from './site-plan.service';
import { FinalProposalService } from '../final-proposal/final-proposal.service';
import { ProjectService } from '../project.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { SubContractStatus } from '../../contractor/enums';
import { SubContractService } from '../sub-contract/sub-contract.service';
import { NotificationService } from '../../notification/notification.service';
import { EmailService } from '../../email/email.service';
import { UsersService } from '../../users/users.service';

@ApiTags('Site Plan')
@Controller('api/project')
export class SitePlanController {
  constructor(
    private sitePlanService: SitePlanService,
    private finalProposalService: FinalProposalService,
    private projectService: ProjectService,
    private subContractService: SubContractService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private userService: UsersService,
  ) {

  }

  @Post(':projectId/sub-contract/:subContractId/site-plan')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @ApiParam({ name: 'projectId', required: true })
  @ApiParam({ name: 'subContractId', required: true })
  @ApiOkResponse({ type: () => SitePlan })
  async saveSitePlan(@Param('projectId') projectId: string, @Param('subContractId') subContractId: string, @Body() payload: SitePlanDto): Promise<SitePlan> {
    const subContract = await this.subContractService.findById(subContractId);
    if (!subContract) {
      throw new NotFoundException('Sub contract not found.');
    }
    if (payload.accessoryMaterialDetails.length === 0) {
      throw new BadRequestException('There should be at least 1 project accessory.');
    }
    if (payload.accessoryMaterialDetails.length !== payload.costItems.length) {
      throw new BadRequestException('Accessory material and cost items does not match.');
    }
    const contractorUser = await this.userService.findUserById(subContract.contractor.user.id);
    const project = await this.projectService.findProjectById(subContract.project.id);
    const sitePlan = await this.sitePlanService.findBySubContractId(subContract.id);
    const hasSitePlan = Boolean(sitePlan);
    subContract.sitePlan = await this.sitePlanService.saveFromDto(payload, sitePlan);
    subContract.status = SubContractStatus.SitePlanned;
    await this.subContractService.updateSubContract(subContract);
    if (!hasSitePlan) {
      await this.notificationService.consultantInvitedContractorToProjectEvent(contractorUser, project);
      this.emailService.sendInvitedToProjectEmail(contractorUser, project);
    } else {
      await this.notificationService.sitePlanUpdatedEvent(contractorUser, project);
      this.emailService.sendSitePlanUpdatedEmail(contractorUser, project);
    }
    return this.sitePlanService.findById(subContract.sitePlan.id);
  }

  @Get(':projectId/sub-contract/:subContractId/site-plan')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant, UserRole.Contractor])
  @ApiParam({ name: 'projectId', required: true })
  @ApiParam({ name: 'subContractId', required: true })
  @ApiOkResponse({ type: () => SitePlan })
  async getSitePlan(@Request() request, @Param('projectId') projectId: string, @Param('subContractId') subContractId: string): Promise<SitePlan> {
    const sitePlan = await this.sitePlanService.findBySubContractId(subContractId);
    if (sitePlan) {
      return sitePlan;
    }
    const finalProposal = await this.finalProposalService.findProposalFromProjectId(projectId);
    return this.sitePlanService.getEmptySitePlan(finalProposal);
  }
}
