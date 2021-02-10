import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ContractorProfile } from './contractor-profile.entity';
import { ExperienceLevel } from '../enums';

@Entity('hardscape_crew')
export class HardscapeCrew extends SoftDelete {
  @ManyToOne(() => ContractorProfile, contractorProfile => contractorProfile.hardscapeCrews)
  contractorProfile: ContractorProfile;

  @Column()
  position: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;
}
