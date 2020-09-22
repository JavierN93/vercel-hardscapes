import { ApiProperty } from '@nestjs/swagger';

import { ContractorClass, ContractorStatus, HardscapingPropertyType } from '../../users/enums';
import { ContractorProfile } from '../../users/entities/contractor-profile.entity';

export class ContractorUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: HardscapingPropertyType, isArray: true })
  propertyTypes: HardscapingPropertyType[];

  @ApiProperty({ enum: ContractorStatus })
  status: ContractorStatus;

  @ApiProperty()
  joinDate: string;

  @ApiProperty({ enum: ContractorClass })
  contractorClass: ContractorClass;

  @ApiProperty()
  projectCount: number;

  static fromContractorProfile(contractor: ContractorProfile): ContractorUserDto {
    return {
      id: contractor.user.id,
      contractorClass: contractor.contractorClass,
      joinDate: contractor.createdAt,
      email: contractor.user.email,
      avatar: contractor.user.avatar,
      name: `${contractor.user.firstName} ${contractor.user.lastName}`,
      phone: contractor.user.phone,
      projectCount: contractor.projects?.length,
      propertyTypes: contractor.propertyTypes,
      status: contractor.status,
    };
  }
}
