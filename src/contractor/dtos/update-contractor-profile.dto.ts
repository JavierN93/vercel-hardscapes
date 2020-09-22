import { ApiProperty } from '@nestjs/swagger';

import { HardscapingPropertyType } from '../../users/enums';
import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../../idea-board/enums';
import { UpdatePortfolioDto } from '../../portfolio/dtos/update-portfolio.dto';

export class UpdateContractorProfileDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  companyName?: string;

  @ApiProperty({ required: false })
  companyWebsite?: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty({ enum: HardscapingPropertyType, isArray: true })
  propertyTypes: HardscapingPropertyType[];

  @ApiProperty({ enum: ProjectAccessoryType, isArray: true })
  serviceTypes: ProjectAccessoryType[];

  @ApiProperty({ enum: MaterialType, isArray: true })
  materialTypes: MaterialType[];

  @ApiProperty({ type: Number, isArray: true })
  preferredBudget: number[];

  @ApiProperty()
  businessComment: string;

  @ApiProperty()
  operationComment: string;

  @ApiProperty()
  timePerProject: string;

  @ApiProperty({ required: false })
  instagramLink?: string;

  @ApiProperty({ required: false })
  facebookLink?: string;

  @ApiProperty({ required: false })
  googleBusinessLink?: string;

  @ApiProperty({ required: false })
  otherSocialLink?: string;

  @ApiProperty()
  portfolios: UpdatePortfolioDto[];
}
