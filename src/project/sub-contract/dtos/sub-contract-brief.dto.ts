import { ApiProperty } from '@nestjs/swagger';

import { SubContractStatus } from '../../../contractor/enums';
import { SubContract } from '../entities/sub-contract.entity';
import { ProjectAccessoryType } from '../../enums';
import { SubContractService } from '../sub-contract.service';

export class SubContractBriefDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  cost: number;

  @ApiProperty({ enum: SubContractStatus })
  status: SubContractStatus;

  @ApiProperty({ enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

  @ApiProperty()
  address: string;

  static fromProject(project: SubContract): SubContractBriefDto {
    const sitePlan = project.sitePlan;
    const cost = sitePlan ? SubContractService.totalPriceFromSitePlan(sitePlan) : 0;
    return {
      id: project.project.id,
      name: project.project.name,
      startDate: sitePlan?.startDate,
      cost,
      projectType: project.project.projectType,
      address: project.project.address,
      status: project.status
    };
  }
}
