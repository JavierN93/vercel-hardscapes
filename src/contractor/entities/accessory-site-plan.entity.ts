import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../../idea-board/enums';

@Entity('accessory_site_plan')
export class AccessorySitePlan extends SoftDelete {
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @Column({ type: 'enum', enum: MaterialType, array: true, default: [] })
  materialTypes: MaterialType[];

  @Column({ default: '' })
  comment: string;

  @Column({ type: 'text', array: true, default: '{}' })
  attachments: string[];
}
