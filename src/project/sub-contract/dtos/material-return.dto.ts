import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { AmountType } from '../../material-order/enums';

export class MaterialReturnDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: string;

  @ApiProperty({ enum: AmountType })
  @IsEnum(AmountType)
  amountType: AmountType;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: [String] })
  attachments: string[];
}
