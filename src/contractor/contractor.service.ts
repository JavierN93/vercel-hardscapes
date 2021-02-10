import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContractorProfile } from '../users/entities/contractor-profile.entity';
import { User } from '../users/entities/user.entity';
import { UpdateContractorProfileDto } from './dtos/update-contractor-profile.dto';
import { getFromDto } from '../common/utils/repository.util';
import { ContractorStatus } from '../users/enums';
import { HardscapeCrew } from '../users/entities/hardscape-crew.entity';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorProfile) private contractorRepository: Repository<ContractorProfile>,
    @InjectRepository(HardscapeCrew) private hardscapeCrewRepository: Repository<HardscapeCrew>,
  ) {
  }

  saveContractorProfile(user: User, hardscapeCrews: HardscapeCrew[], payload: UpdateContractorProfileDto): Promise<ContractorProfile> {
    const contractorProfile = getFromDto<ContractorProfile>(payload, user.contractorProfile || new ContractorProfile());
    contractorProfile.hardscapeCrews = hardscapeCrews;
    contractorProfile.status = ContractorStatus.UserCreated;
    return this.contractorRepository.save(contractorProfile);
  }

  updateContractorProfile(contractorProfile: ContractorProfile): Promise<ContractorProfile> {
    return this.contractorRepository.save(contractorProfile);
  }

  addHardscapeCrews(hardscapeCrews: HardscapeCrew[]): Promise<HardscapeCrew[]> {
    return this.hardscapeCrewRepository.save(hardscapeCrews);
  }
}
