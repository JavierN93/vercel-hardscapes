import { Entity, OneToMany, OneToOne } from 'typeorm';

import { User } from './user.entity';
import { Project } from '../../project/entities/project.entity';
import { SoftDelete } from '../../common/core/soft-delete';

@Entity('consultant_profile')
export class ConsultantProfile extends SoftDelete {
  @OneToOne(() => User, user => user.consultantProfile)
  user: User;

  @OneToMany(() => Project, project => project.consultant)
  projects: Project[];
}
