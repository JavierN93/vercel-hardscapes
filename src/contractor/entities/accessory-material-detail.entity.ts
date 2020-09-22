import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../../idea-board/enums';
import { SitePlan } from './site-plan.entity';

@Entity('accessory_material_detail')
export class AccessoryMaterialDetail extends SoftDelete {
  @ManyToOne(() => SitePlan, sitePlan => sitePlan.accessoryMaterialDetails)
  sitePlan: SitePlan;

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({ type: 'enum', enum: MaterialType, array: true, default: [] })
  materials: MaterialType[];

  @ApiProperty()
  @Column({ default: '' })
  comment: string;

  @ApiProperty({ type: [String] })
  @Column({ type: 'text', array: true, default: '{}' })
  attachments: string[];
}
