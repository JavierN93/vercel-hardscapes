import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CostItem } from './cost-item.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { CustomPaymentItem } from './custom-payment-item.entity';
import { SubContract } from '../../project/sub-contract/entities/sub-contract.entity';
import { AccessoryMaterialDetail } from './accessory-material-detail.entity';

@Entity('site_plan')
export class SitePlan extends SoftDelete {
  @OneToOne(() => SubContract, project => project.sitePlan)
  project: SubContract;

  @ApiProperty()
  @Column({ default: '' })
  brief: string;

  @ApiProperty()
  @Column({ default: '' })
  existingSiteAssessment: string;

  @ApiProperty({ type: () => CostItem, isArray: true })
  @OneToMany(() => CostItem, costItem => costItem.sitePlan)
  costItems: CostItem[];

  @ApiProperty({ type: () => CustomPaymentItem, isArray: true })
  @OneToMany(() => CustomPaymentItem, item => item.sitePlan)
  customPaymentItems: CustomPaymentItem[];

  @ApiProperty({ type: () => AccessoryMaterialDetail, isArray: true })
  @OneToMany(() => AccessoryMaterialDetail, item => item.sitePlan)
  accessoryMaterialDetails: AccessoryMaterialDetail[];

  @ApiProperty()
  @Column()
  discount: number;

  @ApiProperty()
  @Column()
  startDate: Date;

  @ApiProperty()
  @Column()
  endDate: Date;

  @ApiProperty()
  @Column()
  comment: string;
}
