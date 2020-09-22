import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { CustomPaymentItemType } from '../../../contractor/enums';

export class CustomPaymentItemDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: CustomPaymentItemType })
  @IsEnum(CustomPaymentItemType)
  type: CustomPaymentItemType;

  @ApiProperty()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsNumber()
  cost: number;
}
