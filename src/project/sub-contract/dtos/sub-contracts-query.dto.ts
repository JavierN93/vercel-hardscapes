import { ApiProperty } from '@nestjs/swagger';

import { SubContractStatus } from '../../../contractor/enums';
import { SortByDateType } from '../../../common/enums/query.enum';

export class SubContractsQueryDto {
  @ApiProperty({ enum: SortByDateType, required: false })
  sort: SortByDateType;
}

export class ActiveSubContractsQueryDto extends SubContractsQueryDto {
  @ApiProperty({ enum: SubContractStatus, required: false })
  status: SubContractStatus;
}
