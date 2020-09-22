import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ProjectAccessoryType } from '../../enums';

export class CostItemDto {
  @ApiProperty({ enum: ProjectAccessoryType })
  @IsEnum(ProjectAccessoryType)
  type: ProjectAccessoryType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsNumber()
  cost: number;
}
