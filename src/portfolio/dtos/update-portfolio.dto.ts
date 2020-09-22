import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortfolioDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: String, isArray: true })
  attachments: string[];
}
