import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../../common/core/soft-delete';
import { SubContractMilestoneType } from '../../../contractor/enums';
import { SubContract } from './sub-contract.entity';
import { MilestoneStatus } from '../../enums';
import { ColumnNumericTransformer } from '../../../common/utils/typeorm.util';

@Entity('sub_contract_milestone')
export class SubContractMilestone extends SoftDelete {
  @ManyToOne(() => SubContract, project => project.milestones)
  project: SubContract;

  @ApiProperty({ enum: SubContractMilestoneType })
  @Column({ type: 'enum', enum: SubContractMilestoneType })
  type: SubContractMilestoneType;

  @ApiProperty()
  @Column('numeric', {
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
    },
  )
  amount: number;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  paidAt: Date;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty()
  @Column({ default: '' })
  paymentIntentId: string;

  @ApiProperty({ type: 'enum', enum: MilestoneStatus })
  @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.Pending })
  status: MilestoneStatus;

  constructor(project: SubContract, type: SubContractMilestoneType, amount: number, comment: string) {
    super();
    this.project = project;
    this.type = type;
    this.amount = amount;
    this.comment = comment;
  }
}
