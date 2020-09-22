import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

import { ProjectAccessoryType } from '../../enums';
import { MaterialType } from '../../../idea-board/enums';

export class AccessoryMaterialDetailDto {
  @ApiProperty({ enum: ProjectAccessoryType })
  @IsEnum(ProjectAccessoryType)
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @IsArray()
  materials: MaterialType[];

  @ApiProperty()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  attachments: string[];
}
