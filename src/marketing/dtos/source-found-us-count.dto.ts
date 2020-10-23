import { ApiProperty } from '@nestjs/swagger';

import { SourceFoundUs } from '../../common/enums/source-found-us.enum';

export class SourceFoundUsCountDto {
  @ApiProperty({ enum: SourceFoundUs })
  sourceFoundUs: SourceFoundUs;

  @ApiProperty()
  count: number;
}
