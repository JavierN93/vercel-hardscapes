import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ContractorClass } from '../../users/enums';

export class ApproveReputationDto {
  @ApiProperty({ enum: ContractorClass })
  @IsEnum(ContractorClass)
  rate: ContractorClass;
}
