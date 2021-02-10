import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ExperienceLevel } from '../../users/enums';

export class HardscapeCrewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;
}
