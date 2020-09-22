import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { SubContractDeclineReason } from '../../contractor/enums';

export class DeclineDto {
  @ApiProperty({ enum: SubContractDeclineReason, isArray: true })
  @IsArray()
  declineReasons: SubContractDeclineReason[];

  @ApiProperty({ required: false })
  declineComment: string;
}
