import { ApiProperty } from '@nestjs/swagger';

export class PortfolioDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: String, isArray: true })
  attachments: string[];
}
