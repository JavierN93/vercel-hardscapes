import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { SubContractActivityType } from '../enums';
import { SubContract } from './sub-contract.entity';

@Entity('sub_contract_activity')
export class SubContractActivity extends SoftDelete{
  @Column({ type: 'enum', enum: SubContractActivityType })
  type: SubContractActivityType;

  @Column()
  date: Date;

  @ManyToOne(() => SubContract, subContract => subContract.activity)
  subContract: SubContract;

  constructor(subContract: SubContract, type: SubContractActivityType) {
    super();
    this.subContract = subContract;
    this.type = type;
    this.date = new Date();
  }
}
