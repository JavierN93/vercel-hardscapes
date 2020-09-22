import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { CustomPaymentItemType } from '../enums';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { SitePlan } from './site-plan.entity';

@Entity('custom_payment_item')
export class CustomPaymentItem extends SoftDelete {
  @ManyToOne(() => SitePlan, sitePlan => sitePlan.customPaymentItems)
  sitePlan: SitePlan;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: CustomPaymentItemType })
  @Column({ type: 'enum', enum: CustomPaymentItemType })
  type: CustomPaymentItemType;

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
