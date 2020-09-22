import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContractorProfile } from '../users/entities/contractor-profile.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { User } from '../users/entities/user.entity';
import { UpdateContractorProfileDto } from './dtos/update-contractor-profile.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorProfile) private contractorRepository: Repository<ContractorProfile>,
  ) {
  }

  saveContractorProfile(user: User, portfolios: Portfolio[], payload: UpdateContractorProfileDto): Promise<ContractorProfile> {
    const contractorProfile = getFromDto<ContractorProfile>(payload, user.contractorProfile || new ContractorProfile());
    contractorProfile.portfolios = portfolios;
    return this.contractorRepository.save(contractorProfile);
  }

  updateContractorProfile(contractorProfile: ContractorProfile): Promise<ContractorProfile> {
    return this.contractorRepository.save(contractorProfile);
  }
}
