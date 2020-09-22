import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubContractActivity } from './entities/sub-contract-activity.entity';
import { SubContractActivityType } from './enums';
import { SubContract } from './entities/sub-contract.entity';

@Injectable()
export class SubContractActivityService {
  constructor(
    @InjectRepository(SubContractActivity)
    private subContractActivityRepository: Repository<SubContractActivity>,
  ) {
  }

  add(subContract: SubContract, type: SubContractActivityType): Promise<SubContractActivity> {
    return this.subContractActivityRepository.save(new SubContractActivity(subContract, type));
  }
}
