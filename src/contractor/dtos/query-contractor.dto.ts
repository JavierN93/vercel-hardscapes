import { ApiProperty } from '@nestjs/swagger';

import { ContractorClass, ContractorStatus } from '../../users/enums';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QueryContractorDto extends PaginationDto {
  @ApiProperty({ enum: ContractorStatus, required: false })
  status?: ContractorStatus;

  @ApiProperty({ enum: ContractorClass, required: false })
  contractorClass?: ContractorClass;
}
