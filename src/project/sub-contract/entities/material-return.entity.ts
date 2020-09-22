import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { AmountType } from '../../material-order/enums';
import { SubContract } from './sub-contract.entity';

@Entity('material_return')
export class MaterialReturn extends SoftDelete {
  @ManyToOne(() => SubContract, project => project.returnedMaterials)
  project: SubContract;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  amount: string;

  @Column({ type: 'enum', enum: AmountType, default: undefined, nullable: true })
  amountType: AmountType;

  @Column({ default: '' })
  brand: string;

  @Column({ default: '' })
  color: string;

  @Column({ default: '' })
  comment: string;

  @Column({ type: 'text', array: true, default: '{}' })
  attachments: string[];
}
