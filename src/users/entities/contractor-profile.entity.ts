import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { SubContract } from '../../project/sub-contract/entities/sub-contract.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MaterialType } from '../../idea-board/enums';
import { ContractorClass, ContractorStatus, HardscapingPropertyType } from '../enums';
import { ProjectAccessoryType } from '../../project/enums';
import { PortfolioDto } from '../../portfolio/dtos/portfolio.dto';
import { NumericRangeTransformer } from '../../common/utils/typeorm.util';

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

  @ApiProperty({ type: () => PortfolioDto, isArray: true })
  @OneToMany(() => Portfolio, portfolio => portfolio.contractorProfile)
  portfolios: Portfolio[];

  @OneToMany(() => SubContract, project => project.contractor)
  projects: SubContract[];

}
