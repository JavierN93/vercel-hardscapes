import { ApiProperty } from '@nestjs/swagger';

import { DrainageType, MachineAccessType, PreferredColor, PropertyGradeType, SoilType } from '../../enums';
import { SiteVisitAccessory, SiteVisitAccessoryWithType } from '../entities/site-visit.entity';

export class UpdateSiteVisitDto {

  @ApiProperty()
  propertyOverView: string;

  @ApiProperty({ type: [String] })
  attachments: string[];

  @ApiProperty()
  manufacturer: string;

  @ApiProperty()
  productName: string;

  @ApiProperty({ enum: PreferredColor, isArray: true })
  preferredColors: PreferredColor[];

  @ApiProperty()
  preferredSize: string;

  @ApiProperty()
  preferredTexture: string;

  @ApiProperty()
  preferredPrice: string;

  @ApiProperty()
  additionalDesign: string;

  @ApiProperty({ type: () => SiteVisitAccessory })
  machineAccess: SiteVisitAccessoryWithType<MachineAccessType>;

  @ApiProperty({ type: () => SiteVisitAccessory })
  soil: SiteVisitAccessoryWithType<SoilType>;

  @ApiProperty({ type: () => SiteVisitAccessory })
  propertyGrade: SiteVisitAccessoryWithType<PropertyGradeType>;

  @ApiProperty({ type: () => SiteVisitAccessory })
  drainage: SiteVisitAccessoryWithType<DrainageType>;

  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorUtilities: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorHazards: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorInconveniences: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  materialStorage: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  materialHaulOut: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  downspouts: SiteVisitAccessory;

  @ApiProperty({ type: () => SiteVisitAccessory })
  shrubRemoval: SiteVisitAccessory;
}
