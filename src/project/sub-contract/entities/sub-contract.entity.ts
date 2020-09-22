import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../../common/core/soft-delete';
import { ContractorProfile } from '../../../users/entities/contractor-profile.entity';
import { Project } from '../../entities/project.entity';
import { SitePlan } from '../../../contractor/entities/site-plan.entity';
import { SubContractMilestone } from './sub-contract-milestone.entity';
import { MaterialReturn } from './material-return.entity';
import { SubContractStatus, SubContractDeclineReason } from '../../../contractor/enums';
import { User } from '../../../users/entities/user.entity';
import { SubContractActivity } from './sub-contract-activity.entity';

@Entity('sub_contract')
export class SubContract extends SoftDelete {
  @ManyToOne(() => ContractorProfile, contractor => contractor.projects)
  contractor: ContractorProfile;

  @OneToMany(() => SubContractActivity, activity => activity.subContract)
  activity: SubContractActivity[];

  @ManyToOne(() => Project, project => project.subContracts)
  project: Project;

  @OneToOne(() => SitePlan, sitePlan => sitePlan.project)
  @JoinColumn()
  sitePlan: SitePlan;

  @OneToMany(() => SubContractMilestone, milestone => milestone.project)
  milestones: SubContractMilestone[];

  @ApiProperty({ enum: SubContractStatus })
  @Column({ type: 'enum', enum: SubContractStatus, default: undefined, nullable: true })
  status: SubContractStatus;

  @ApiProperty({ type: [String] })
  @Column({ type: 'text', array: true, default: '{}' })
  gradePhotos: string[];

  @ApiProperty()
  @Column({ default: '' })
  gradeComment: string;

  @ApiProperty({ type: [String] })
  @Column({ type: 'text', array: true, default: '{}' })
  baseInstallationPhotos: string[];

  @ApiProperty()
  @Column({ default: '' })
  baseInstallationComment: string;

  @ApiProperty({ type: [String] })
  @Column({ type: 'text', array: true, default: '{}' })
  finalPhotos: string[];

  @OneToMany(() => MaterialReturn, materialReturn => materialReturn.project)
  returnedMaterials: MaterialReturn[];

  @ApiProperty({ enum: SubContractDeclineReason, isArray: true })
  @Column({ type: 'enum', enum: SubContractDeclineReason, array: true, default: [] })
  declineReasons: SubContractDeclineReason[];

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  declineComment: string;

  consultant?: User;
}
