import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../project/enums';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { SitePlan } from './site-plan.entity';

@Entity('cost_item')
export class CostItem extends SoftDelete {
  @ManyToOne(() => SitePlan, sitePlan => sitePlan.costItems)
  sitePlan: SitePlan;

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty()
  @Column('numeric', {
    default: 0,
    precision: 17,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  cost: number;
}
