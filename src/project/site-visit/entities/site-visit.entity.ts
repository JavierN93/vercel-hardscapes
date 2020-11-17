import { Column, Entity, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../../common/core/soft-delete';
import { DrainageType, MachineAccessType, PreferredColor, PropertyGradeType, SoilType } from '../../enums';
import { Project } from '../../entities/project.entity';

export class SiteVisitAccessory {
  @ApiProperty()
  comment: string;

  @ApiProperty({ type: [String] })
  attachments: string[];
}

export class SiteVisitAccessoryWithType<T> extends SiteVisitAccessory {
  type: T;
}

@Entity('site_visit')
export class SiteVisit extends SoftDelete {

  @OneToOne(() => Project, project => project.siteVisit)
  project: Project;

  @Column({ type: 'text', default: '', nullable: true })
  @ApiProperty()
  propertyOverview: string;

  @Column({ type: 'text', array: true, default: undefined, nullable: true })
  @ApiProperty({ type: [String] })
  attachments: string[];

  @Column({ default: '' })
  @ApiProperty()
  manufacturer: string;

  @Column({ default: '' })
  @ApiProperty()
  productName: string;

  @Column({ type: 'enum', enum: PreferredColor, array: true, default: [] })
  @ApiProperty({ enum: PreferredColor, isArray: true })
  preferredColors: PreferredColor[];

  @Column({ default: '' })
  @ApiProperty()
  preferredSize: string;

  @Column({ default: '' })
  @ApiProperty()
  preferredTexture: string;

  @Column({ default: '' })
  @ApiProperty()
  preferredPrice: string;

  @Column({ default: '' })
  @ApiProperty()
  additionalDesign: string;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  machineAccess: SiteVisitAccessoryWithType<MachineAccessType>;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  soil: SiteVisitAccessoryWithType<SoilType>;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  propertyGrade: SiteVisitAccessoryWithType<PropertyGradeType>;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  drainage: SiteVisitAccessoryWithType<DrainageType>;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorUtilities: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorHazards: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  exteriorInconveniences: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  materialStorage: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  materialHaulOut: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  downspouts: SiteVisitAccessory;

  @Column({ type: 'jsonb', default: undefined, nullable: true })
  @ApiProperty({ type: () => SiteVisitAccessory })
  shrubRemoval: SiteVisitAccessory;
}
