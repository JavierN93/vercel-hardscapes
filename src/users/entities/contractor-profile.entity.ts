import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';
import { SubContract } from '../../project/sub-contract/entities/sub-contract.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MaterialType } from '../../idea-board/enums';
import { ContractorClass, ContractorStatus, HardscapingPropertyType } from '../enums';
import { ProjectAccessoryType } from '../../project/enums';
import { NumericRangeTransformer } from '../../common/utils/typeorm.util';
import { HardscapeCrew } from './hardscape-crew.entity';

@Entity('contractor_profile')
export class ContractorProfile extends SoftDelete {
  @OneToOne(() => User, user => user.contractorProfile)
  user: User;

  @ApiProperty()
  @Column({ default: '' })
  companyName: string;

  @ApiProperty()
  @Column({ default: '' })
  companyWebsite: string;

  @ApiProperty({ enum: HardscapingPropertyType, isArray: true })
  @Column({
    type: 'enum',
    enum: HardscapingPropertyType,
    array: true,
    default: [],
  })
  propertyTypes: HardscapingPropertyType[];

  @ApiProperty({ enum: ProjectAccessoryType, isArray: true })
  @Column({
    type: 'enum',
    enum: ProjectAccessoryType,
    array: true,
    default: [],
  })
  serviceTypes: ProjectAccessoryType[];

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({
    type: 'enum',
    enum: MaterialType,
    array: true,
    default: [],
  })
  materialTypes: MaterialType[];

  @ApiProperty({ type: Number, isArray: true })
  @Column({ type: 'int8range', default: [0, 100000], transformer: new NumericRangeTransformer() })
  preferredBudget: number[];

  @ApiProperty()
  @Column({ default: '' })
  businessComment: string;

  @ApiProperty()
  @Column({ default: '' })
  operationComment: string;

  @ApiProperty()
  @Column({ default: '' })
  timePerProject: string;


  @ApiProperty()
  @Column({ default: '' })
  excavationEquipmentComment: string;

  @ApiProperty()
  @Column({ default: '' })
  truckComment: string;

  @ApiProperty()
  @Column({ default: '' })
  compactionEquipmentComment: string;

  @ApiProperty()
  @Column({ default: '' })
  instagramLink: string;

  @ApiProperty()
  @Column({ default: '' })
  facebookLink: string;

  @ApiProperty()
  @Column({ default: '' })
  googleBusinessLink: string;

  @ApiProperty()
  @Column({ default: '' })
  otherSocialLink: string;

  @OneToMany(() => HardscapeCrew, hardscapeCrew => hardscapeCrew.contractorProfile)
  hardscapeCrews: HardscapeCrew[];

  @ApiProperty({ enum: ContractorStatus })
  @Column({ type: 'enum', enum: ContractorStatus, default: ContractorStatus.InvitationSent })
  status: ContractorStatus;

  @ApiProperty({ enum: ContractorClass })
  @Column({ type: 'enum', enum: ContractorClass, default: undefined, nullable: true })
  contractorClass: ContractorClass;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  subContractorAgreementSignedDate: Date;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  ndaSignedDate: Date;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  workingAgreementSignedDate: Date;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  stripeAccountId: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  bankName: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  bankAccountName: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  bankAccountNumber: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  bankRoutingNumber: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  bankAccountAddress: string;

  @OneToMany(() => SubContract, project => project.contractor)
  projects: SubContract[];

}
