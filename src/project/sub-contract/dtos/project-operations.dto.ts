import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { MaterialReturnDto } from './material-return.dto';
import { SubContractStatus } from '../../../contractor/enums';

export class ProjectOperationDto {
  @ApiProperty({ enum: SubContractStatus })
  nextStep: SubContractStatus;

  @ApiProperty({ type: [String], required: false })
  gradePhotos?: string[];

  @ApiProperty({ required: false })
  gradeComment?: string;

  @ApiProperty({ type: [String], required: false })
  baseInstallationPhotos?: string[];

  @ApiProperty({ required: false })
  baseInstallationComment?: string;

  @ApiProperty({ type: [String], required: false })
  finalPhotos?: string[];

  @ApiProperty({ type: () => MaterialReturnDto, isArray: true, required: false })
  @Type(() => MaterialReturnDto)
  returnedMaterials?: MaterialReturnDto[];
}
