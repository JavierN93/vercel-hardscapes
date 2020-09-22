import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { ActiveSubContractsQueryDto, SubContractsQueryDto } from './dtos/sub-contracts-query.dto';
import { SubContractBriefDto } from './dtos/sub-contract-brief.dto';
import { UsersService } from '../../users/users.service';
import { ProjectService } from '../project.service';
import { SubContractService } from './sub-contract.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { SubContract } from './entities/sub-contract.entity';
import { SubContractMilestoneType, SubContractStatus } from '../../contractor/enums';
import { DeclineDto } from '../dtos/decline.dto';
import { SuccessResponse } from '../../common/models/success-response';
import { ProjectOperationDto } from './dtos/project-operations.dto';
import { getFromDto } from '../../common/utils/repository.util';
import { MaterialReturn } from './entities/material-return.entity';
import { SubContractMilestone } from './entities/sub-contract-milestone.entity';
import { MilestoneStatus } from '../enums';
import { PaymentService } from '../../payment/payment.service';
import { NotificationService } from '../../notification/notification.service';
import { EmailService } from '../../email/email.service';
import { SubContractActivityService } from './sub-contract-activity.service';
import { SubContractActivityType } from './enums';
import { MaterialOrderService } from '../material-order/material-order.service';
import { MaterialOrderItem } from '../material-order/entities/material-order-item.entity';

@ApiTags('Sub Contract')
@Controller('api')
export class SubContractController {

  constructor(
    private userService: UsersService,
    private projectService: ProjectService,
    private materialOrderService: MaterialOrderService,
    private subContractService: SubContractService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private subContractActivityService: SubContractActivityService,
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('sub-contracts/invited')
  @ApiOkResponse({ type: () => SubContractBriefDto, isArray: true })
  async invitedProjects(@Request() request, @Query() query: SubContractsQueryDto): Promise<SubContractBriefDto[]> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const contractorProfile = contractorUser.contractorProfile;
    const subContracts = await this.subContractService.findInvitedSubContractsByContractorId(contractorProfile.id, query.sort);
    return subContracts.map(project => SubContractBriefDto.fromProject(project));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor, UserRole.Consultant])
  @Get('project/:id/sub-contracts')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => SubContract, isArray: true })
  async getSubContracts(@Param('id') id: string): Promise<SubContract[]> {
    const project = await this.projectService.findProjectById(id);
    const subContracts = await this.subContractService.findByProjectId(id);
    const consultantUser = await this.userService.findUserByConsultantId(project.consultant.id);
    subContracts.forEach(subContract => {
      subContract.consultant = consultantUser;
    });
    return subContracts;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('project/:id/sub-contract/milestones')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => SubContractMilestone, isArray: true })
  async milestonesForContractor(@Request() request, @Param('id') projectId: string): Promise<SubContractMilestone[]> {
    const contractorUser = await this.userService.findUserById(request.user.id);
    return this.subContractService.findSubContractMilestonesByProjectIdAndContractorId(projectId, contractorUser.contractorProfile.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Get('project/:projectId/sub-contract/:subContractId')
  @ApiParam({ name: 'projectId', required: true })
  @ApiParam({ name: 'subContractId', required: true })
  @ApiOkResponse({ type: () => SubContract })
  async getSubContractFromAdmin(@Param('projectId') projectId: string, @Param('subContractId') subContractId: string): Promise<SubContract> {
    const project = await this.projectService.findProjectById(projectId);
    const subContract = await this.subContractService.findById(subContractId);
    subContract.consultant = await this.userService.findUserByConsultantId(project.consultant.id);
    return subContract;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('project/:projectId/sub-contract')
  @ApiParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => SubContract })
  async getSubContractFromContractor(@Request() request, @Param('projectId') projectId: string): Promise<SubContract> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const project = await this.projectService.findProjectById(projectId);
    const subContract = await this.subContractService.findByProjectIdAndContractorId(projectId, contractorUser.contractorProfile.id);
    subContract.consultant = await this.userService.findUserByConsultantId(project.consultant.id);
    const materialOrderGroups = await this.materialOrderService.findOrderGroupsByProjectId(projectId);
    const materialItems: MaterialOrderItem[] = materialOrderGroups.reduce((merged, orderGroup) => [...merged, ...orderGroup.items], []);
    if (!subContract.returnedMaterials.length) {
      subContract.returnedMaterials = materialItems.map(item => {
        const material = new MaterialReturn();
        material.name = item.name;
        material.amountType = item.amountType;
        material.brand = item.brand;
        material.color = item.color;
        material.comment = item.comment;
        material.attachments = [];
        return material;
      });
    }
    return subContract;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('project/:id/sub-contract/:subContractId/milestones')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => SubContractMilestone, isArray: true })
  async milestonesForConsultant(@Param('id') projectId: string, @Param('subContractId') subContractId: string): Promise<SubContractMilestone[]> {
    return this.subContractService.findSubContractMilestonesBySubContractId(subContractId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('sub-contracts/active')
  @ApiOkResponse({ type: () => SubContractBriefDto, isArray: true })
  async activeProjects(@Request() request, @Query() query: ActiveSubContractsQueryDto): Promise<SubContractBriefDto[]> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const contractorProfile = contractorUser.contractorProfile;
    const subContracts = await this.subContractService.findActiveSubContractsByContractorId(contractorProfile.id, query.sort, query.status);
    return subContracts.map(project => SubContractBriefDto.fromProject(project));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post('project/:projectId/sub-contract/accept')
  @ApiParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => SubContract })
  async accept(@Request() request, @Param('projectId') projectId: string): Promise<SubContract> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const contractorProfile = contractorUser.contractorProfile;
    let subContract = await this.subContractService.findByProjectIdAndContractorId(projectId, contractorUser.contractorProfile.id);
    if (subContract.contractor?.id !== contractorProfile.id) {
      throw new BadRequestException('You are not invited to this project.');
    }
    const sitePlan = subContract.sitePlan;
    if (!sitePlan) {
      throw new BadRequestException('Site plan is not made yet.');
    }
    subContract.status = SubContractStatus.Accepted;
    await this.subContractService.saveCustomPaymentItems(sitePlan.customPaymentItems);

    // make milestones(remove all if exists)
    await this.subContractService.clearMilestones(subContract);
    subContract.milestones = await this.subContractService.createMilestones(subContract);
    await this.subContractService.saveSubContract(subContract);
    const admins = await this.userService.findSuperAdmins();
    const project = await this.projectService.findProjectById(projectId);
    subContract = await this.subContractService.findById(subContract.id);
    await this.notificationService.contractorAcceptedProjectEvent(admins, contractorUser, project, subContract);
    admins.forEach(admin => {
      this.emailService.sendSubContractAcceptedEmail(admin, project, subContract, contractorUser);
    });
    await this.subContractActivityService.add(subContract, SubContractActivityType.ProjectAccepted);
    return this.subContractService.findById(subContract.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post('project/:projectId/sub-contract/decline')
  @ApiParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => SubContract })
  async decline(@Request() request, @Param('projectId') projectId, @Body() dto: DeclineDto): Promise<SuccessResponse> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const contractorProfile = contractorUser.contractorProfile;
    const subContract = await this.subContractService.findByProjectIdAndContractorId(projectId, contractorUser.contractorProfile.id);
    if (subContract.contractor?.id !== contractorProfile.id) {
      throw new BadRequestException('You are not invited to this project.');
    }
    subContract.status = SubContractStatus.Declined;
    subContract.declineReasons = dto.declineReasons;
    subContract.declineComment = dto.declineComment;
    await this.subContractService.saveSubContract(subContract);
    const admins = await this.userService.findSuperAdmins();
    const project = await this.projectService.findProjectById(projectId);
    await this.notificationService.contractorDeclinedProjectEvent(admins, contractorUser, project, subContract);
    admins.forEach(admin => {
      this.emailService.sendSubContractDeclinedEmail(admin, project, subContract, contractorUser);
    });
    await this.subContractActivityService.add(subContract, SubContractActivityType.ProjectDeclined);
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor, UserRole.Consultant])
  @Post('project/:projectId/sub-contract/milestone/:milestoneId/request-release')
  @ApiParam({ name: 'projectId', required: true })
  @ApiParam({ name: 'milestoneId', required: true })
  @ApiOkResponse({ type: () => SubContractMilestone })
  async requestRelease(@Request() request,
                       @Param('projectId') projectId: string,
                       @Param('milestoneId') milestoneId: string,
  ): Promise<SubContractMilestone> {
    const userId = request.user.id;
    const requestUser = await this.userService.findUserById(userId);
    const contractorProfile = requestUser.contractorProfile;
    const consultantProfile = requestUser.consultantProfile;
    const milestone = await this.subContractService.findSubContractMilestoneById(milestoneId);
    if (!milestone) {
      throw new NotFoundException();
    }
    let subContract;
    const project = await this.projectService.findProjectById(projectId);
    if (requestUser.role === UserRole.Contractor) {
      subContract = await this.subContractService.findByProjectIdAndContractorId(projectId, contractorProfile.id);
    } else if (requestUser.role === UserRole.Consultant) {
      subContract = await this.subContractService.findById(milestone.project.id);
    }

    if (requestUser.role === UserRole.Contractor && subContract.contractor?.id !== contractorProfile.id) {
      throw new BadRequestException('You are not invited to this project.');
    }
    if (requestUser.role === UserRole.Consultant && project.consultant.id !== consultantProfile.id) {
      throw new BadRequestException('You are not allowed to request the milestone release.');
    }
    if (milestone.project.id !== subContract.id) {
      throw new BadRequestException('The requested milestone does not belong to this sub contract.');
    }
    if (milestone.status === MilestoneStatus.Released) {
      throw new BadRequestException('The milestone is already paid');
    }
    milestone.status = MilestoneStatus.ReleaseRequested;
    const admins = await this.userService.findSuperAdmins();
    if (consultantProfile) {
      await this.notificationService.consultantRequestedMilestoneReleaseEvent(admins, requestUser, project, subContract);
      admins.forEach(admin => {
        this.emailService.sendConsultantRequestedMilestonePaymentEmail(admin, project, subContract, requestUser);
      });
    } else {
      // contractor
      const consultant = project.consultant.user;
      const recipients = admins.find(admin => admin.id === consultant.id) ? admins : [...admins, consultant];
      await this.notificationService.contractorRequestedMilestoneReleaseEvent(recipients, requestUser, project, subContract);
      recipients.forEach(admin => {
        this.emailService.sendContractorRequestedMilestonePaymentEmail(admin, project, subContract, requestUser);
      });
    }
    await this.subContractActivityService.add(subContract, milestone.type === SubContractMilestoneType.Deposit ?
      SubContractActivityType.Milestone1PaymentRequested :
      SubContractActivityType.Milestone2PaymentRequested
    );
    return this.subContractService.saveSubContractMilestone(milestone);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @Post('project/:projectId/sub-contract/milestone/:milestoneId/release')
  @ApiParam({ name: 'projectId', required: true })
  @ApiParam({ name: 'milestoneId', required: true })
  @ApiOkResponse({ type: () => SubContractMilestone })
  async releaseMilestone(@Request() request,
                                @Param('projectId') projectId: string,
                                @Param('milestoneId') milestoneId: string,
  ): Promise<SubContractMilestone> {
    const milestone = await this.subContractService.findSubContractMilestoneById(milestoneId);
    const subContract = await this.subContractService.findById(milestone.project.id);
    const contractor = subContract.contractor;
    if (!milestone) {
      throw new NotFoundException();
    }
    if (milestone.status === MilestoneStatus.Released) {
      throw new BadRequestException('The milestone is already marked as paid');
    }
    milestone.status = MilestoneStatus.Released;
    milestone.paidAt = new Date();
    const user = await this.userService.findUserByContractorId(contractor.id);
    const project = await this.projectService.findProjectById(projectId);
    await this.notificationService.adminPaidSubContractMilestoneEvent(user, project);
    this.emailService.sendReceivedSubContractMilestonePaymentEmail(user, project);
    return this.subContractService.saveSubContractMilestone(milestone);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post('project/:projectId/sub-contract/next-step')
  @ApiParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => SubContract })
  async nextStep(@Request() request,
                 @Param('projectId') projectId: string,
                 @Body() dto: ProjectOperationDto): Promise<SubContract> {
    const userId = request.user.id;
    const contractorUser = await this.userService.findUserById(userId);
    const contractorProfile = contractorUser.contractorProfile;
    const subContract = await this.subContractService.findByProjectIdAndContractorId(projectId, contractorUser.contractorProfile.id);
    if (subContract.contractor?.id !== contractorProfile.id) {
      throw new BadRequestException('You are not invited to this project.');
    }
    const currentStatus = subContract.status;
    const nextStep = dto.nextStep;
    switch (nextStep) {
      case SubContractStatus.SiteVisited: {
        if (currentStatus !== SubContractStatus.Accepted) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.SiteVisited;
        await this.subContractActivityService.add(subContract, SubContractActivityType.SiteVisited);
        break;
      }
      case SubContractStatus.Excavated: {
        if (currentStatus !== SubContractStatus.SiteVisited) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.Excavated;
        await this.subContractActivityService.add(subContract, SubContractActivityType.Excavated);
        break;
      }
      case SubContractStatus.GradeSet: {
        if (currentStatus !== SubContractStatus.Excavated) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        if (!dto.gradePhotos.length) {
          throw new BadRequestException('You should add at least 1 photo.');
        }
        subContract.status = SubContractStatus.GradeSet;
        subContract.gradePhotos = dto.gradePhotos;
        subContract.gradeComment = dto.gradeComment;
        await this.subContractActivityService.add(subContract, SubContractActivityType.GradeSet);
        break;
      }
      case SubContractStatus.BaseInstalled: {
        if (currentStatus !== SubContractStatus.GradeSet) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        if (!dto.baseInstallationPhotos.length) {
          throw new BadRequestException('You should add at least 1 photo.');
        }
        subContract.status = SubContractStatus.BaseInstalled;
        subContract.baseInstallationPhotos = dto.baseInstallationPhotos;
        subContract.baseInstallationComment = dto.baseInstallationComment;
        await this.subContractActivityService.add(subContract, SubContractActivityType.BaseInstalled);
        break;
      }
      case SubContractStatus.Screeded: {
        if (currentStatus !== SubContractStatus.BaseInstalled) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.Screeded;
        await this.subContractActivityService.add(subContract, SubContractActivityType.Screeded);
        break;
      }
      case SubContractStatus.HardscapeInstalled: {
        if (currentStatus !== SubContractStatus.Screeded) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.HardscapeInstalled;
        await this.subContractActivityService.add(subContract, SubContractActivityType.HardscapeInstalled);
        break;
      }
      case SubContractStatus.Adjusted: {
        if (currentStatus !== SubContractStatus.HardscapeInstalled) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.Adjusted;
        await this.subContractActivityService.add(subContract, SubContractActivityType.Adjusted);
        break;
      }
      case SubContractStatus.CleanedUp: {
        if (currentStatus !== SubContractStatus.Adjusted) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        subContract.status = SubContractStatus.CleanedUp;
        await this.subContractActivityService.add(subContract, SubContractActivityType.CleanedUp);
        break;
      }
      case SubContractStatus.FinalPhotosTaken: {
        if (currentStatus !== SubContractStatus.CleanedUp) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        if (dto.finalPhotos.length < 3) {
          throw new BadRequestException('You should add at least 3 photos.');
        }
        subContract.status = SubContractStatus.FinalPhotosTaken;
        subContract.finalPhotos = dto.finalPhotos;
        await this.subContractActivityService.add(subContract, SubContractActivityType.FinalPhotosTaken);
        break;
      }
      case SubContractStatus.MaterialReturned: {
        if (currentStatus !== SubContractStatus.FinalPhotosTaken) {
          throw new BadRequestException('Unable to jump to this step.');
        }
        if (dto.returnedMaterials.find(m => m.attachments.length === 0)) {
          throw new BadRequestException('There should be prove photos attached.');
        }
        subContract.status = SubContractStatus.MaterialReturned;
        subContract.returnedMaterials = await this.subContractService.saveReturnedMaterials(dto.returnedMaterials.map(m => {
          const materialReturn = getFromDto<MaterialReturn>(m, new MaterialReturn());
          if (!materialReturn.id) {
            delete materialReturn.id;
          }
          return materialReturn;
        }));
        const admins = await this.userService.findSuperAdmins();
        const project = await this.projectService.findProjectById(projectId);
        await this.notificationService.contractorFinishedProjectEvent(admins, contractorUser, project, subContract);
        admins.forEach(admin => {
          this.emailService.sendSubContractCompletedEmail(admin, project, subContract, contractorUser);
        });
        await this.subContractActivityService.add(subContract, SubContractActivityType.MaterialReturned);
        break;
      }
      default: {
        throw new BadRequestException('Unrecognized step.');
      }
    }
    delete subContract.activity;
    await this.subContractService.saveSubContract(subContract);
    return this.subContractService.findById(subContract.id);
  }
}
