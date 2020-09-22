import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LegalTermType } from '../enums';

export class SignLegalTermDto {
  @ApiProperty({ enum: LegalTermType })
  @IsEnum(LegalTermType)
  type: LegalTermType;
}
