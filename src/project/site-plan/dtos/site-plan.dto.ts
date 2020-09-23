import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

import { CostItemDto } from './cost-item.dto';
import { CustomPaymentItemDto } from './custom-payment-item.dto';
import { AccessoryMaterialDetailDto } from './accessory-material-detail.dto';

export class SitePlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brief: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  existingSiteAssessment: string;

  @ApiProperty({ type: () => AccessoryMaterialDetailDto, isArray: true })
  @Type(() => AccessoryMaterialDetailDto)
  @ValidateNested({ each: true })
  accessoryMaterialDetails: AccessoryMaterialDetailDto[];

  @ApiProperty({ type: () => CostItemDto, isArray: true })
  @Type(() => CostItemDto)
  @ValidateNested({ each: true })
  costItems: CostItemDto[];

  @ApiProperty({ type: () => CustomPaymentItemDto, isArray: true })
  @Type(() => CustomPaymentItemDto)
  @ValidateNested({ each: true })
  customPaymentItems: CustomPaymentItemDto[];

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ required: false })
  comment?: string;
}
