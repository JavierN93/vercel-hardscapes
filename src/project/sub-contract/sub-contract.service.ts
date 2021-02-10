import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubContract } from './entities/sub-contract.entity';
import { SortByDateType } from '../../common/enums/query.enum';
import { SubContractMilestoneType, SubContractStatus } from '../../contractor/enums';
import { CustomPaymentItem } from '../../contractor/entities/custom-payment-item.entity';
import { SubContractMilestone } from './entities/sub-contract-milestone.entity';
import { SitePlan } from '../../contractor/entities/site-plan.entity';
import { MaterialReturn } from './entities/material-return.entity';
import { subContractMilestoneComment } from './data';

@Injectable()
export class SubContractService {
  constructor(
    @InjectRepository(SubContract) private subContractRepository: Repository<SubContract>,
    @InjectRepository(CustomPaymentItem) private customPaymentItemRepository: Repository<CustomPaymentItem>,
    @InjectRepository(SubContractMilestone) private subContractMilestoneRepository: Repository<SubContractMilestone>,
    @InjectRepository(MaterialReturn) private materialReturnRepository: Repository<MaterialReturn>,
  ) {
  }

  static totalPriceFromSitePlan(sitePlan: SitePlan): number {
    const accessoryPriceTotal = sitePlan.costItems.reduce((sum, costItem) => sum + costItem.cost, 0);
    const customPaymentItemPriceTotal = sitePlan.customPaymentItems.reduce((sum, item) => sum + item.cost, 0);
    return accessoryPriceTotal - customPaymentItemPriceTotal - sitePlan.discount;
  }

  findByProjectIdAndContractorId(projectId: string, contractorId: string): Promise<SubContract> {
    return this.subContractRepository.createQueryBuilder('sub_contract')
      .leftJoinAndSelect('sub_contract.contractor', 'contractor')
      .leftJoinAndSelect('sub_contract.project', 'project')
      .leftJoinAndSelect('project.siteVisit', 'siteVisit')
      .leftJoinAndSelect('sub_contract.activity', 'activity')
      .leftJoinAndSelect('sub_contract.sitePlan', 'sitePlan')
      .leftJoinAndSelect('sitePlan.costItems', 'costItems')
      .leftJoinAndSelect('sitePlan.customPaymentItems', 'customPaymentItems')
      .leftJoinAndSelect('sitePlan.accessoryMaterialDetails', 'accessoryMaterialDetails')
      .leftJoinAndSelect('sub_contract.milestones', 'milestones')
      .leftJoinAndSelect('sub_contract.returnedMaterials', 'returnedMaterials')
      .where('contractor.id = :contractorId', { contractorId })
      .andWhere('project.id = :projectId', { projectId })
      .getOne();
  }

  findInvitedSubContractsByContractorId(id: string, sort?: SortByDateType): Promise<SubContract[]> {
    return this.subContractRepository.createQueryBuilder('sub_contract')
      .leftJoinAndSelect('sub_contract.contractor', 'contractor')
      .leftJoinAndSelect('sub_contract.project', 'project')
      .leftJoinAndSelect('sub_contract.activity', 'activity')
      .leftJoinAndSelect('sub_contract.sitePlan', 'sitePlan')
      .leftJoinAndSelect('sitePlan.costItems', 'costItems')
      .leftJoinAndSelect('sitePlan.customPaymentItems', 'customPaymentItems')
      .where('contractor.id = :id', { id })
      .andWhere('sub_contract.status = :sitePlanned', { sitePlanned: SubContractStatus.SitePlanned })
      .orderBy('sub_contract.createdAt', sort === SortByDateType.FromOldest ? 'ASC' : 'DESC')
      .getMany();
  }

  findActiveSubContractsByContractorId(id: string, sort?: SortByDateType, status?: SubContractStatus): Promise<SubContract[]> {
    return this.subContractRepository.createQueryBuilder('sub_contract')
      .leftJoinAndSelect('sub_contract.contractor', 'contractor')
      .leftJoinAndSelect('sub_contract.project', 'project')
      .leftJoinAndSelect('sub_contract.activity', 'activity')
      .leftJoinAndSelect('sub_contract.sitePlan', 'sitePlan')
      .leftJoinAndSelect('sitePlan.costItems', 'costItems')
      .leftJoinAndSelect('sitePlan.customPaymentItems', 'customPaymentItems')
      .where('contractor.id = :id', { id })
      .andWhere(`sub_contract.status != \'${SubContractStatus.Invited}\' and sub_contract.status != \'${SubContractStatus.SitePlanned}\' and sub_contract.status != \'${SubContractStatus.Declined}\'`)
      .andWhere(status ? 'sub_contract.status = :status' : 'true', { status })
      .orderBy('sub_contract.createdAt', sort === SortByDateType.FromOldest ? 'ASC' : 'DESC')
      .getMany();
  }

  updateSubContract(subContract: SubContract): Promise<SubContract> {
    return this.subContractRepository.save(subContract);
  }

  findById(id: string): Promise<SubContract> {
    return this.subContractRepository.findOne({
      relations: ['project',
        'project.consultant',
        'sitePlan',
        'activity',
        'sitePlan.costItems',
        'sitePlan.customPaymentItems',
        'sitePlan.accessoryMaterialDetails',
        'milestones',
        'contractor',
        'returnedMaterials',
        'contractor.user'],
      where: { id },
    });
  }

  findByProjectId(id: string): Promise<SubContract[]> {
    return this.subContractRepository.createQueryBuilder('sub_contract')
      .leftJoinAndSelect('sub_contract.project', 'project')
      .leftJoinAndSelect('sub_contract.activity', 'activity')
      .leftJoinAndSelect('sub_contract.returnedMaterials', 'returnedMaterials')
      .leftJoinAndSelect('project.consultant', 'consultant')
      .leftJoinAndSelect('sub_contract.sitePlan', 'sitePlan')
      .leftJoinAndSelect('sitePlan.costItems', 'costItems')
      .leftJoinAndSelect('sitePlan.customPaymentItems', 'customPaymentItems')
      .leftJoinAndSelect('sitePlan.accessoryMaterialDetails', 'accessoryMaterialDetails')
      .leftJoinAndSelect('sub_contract.milestones', 'milestones')
      .leftJoinAndSelect('sub_contract.contractor', 'contractor')
      .where('project.id = :id', { id })
      .getMany();
  }

  saveSubContract(subContract: SubContract): Promise<SubContract> {
    return this.subContractRepository.save(subContract);
  }

  saveCustomPaymentItems(customPaymentItems: CustomPaymentItem[]): Promise<CustomPaymentItem[]> {
    return this.customPaymentItemRepository.save(customPaymentItems);
  }

  clearMilestones(subContract: SubContract) {
    this.subContractMilestoneRepository.remove(subContract.milestones);
  }

  async findSubContractMilestonesByProjectIdAndContractorId(projectId: string, contractorId: string): Promise<SubContractMilestone[]> {
    const milestones = await this.subContractMilestoneRepository.createQueryBuilder('sub_contract_milestone')
      .leftJoinAndSelect('sub_contract_milestone.project', 'sub_contract')
      .leftJoinAndSelect('sub_contract.project', 'project')
      .leftJoinAndSelect('sub_contract.contractor', 'contractor')
      .where('project.id = :projectId', { projectId })
      .andWhere('contractor.id = :contractorId', { contractorId })
      .getMany();
    milestones.forEach(milestone => {
      delete milestone.project
    });
    return milestones;
  }

  async findSubContractMilestonesBySubContractId(id: string): Promise<SubContractMilestone[]> {
    const milestones = await this.subContractMilestoneRepository.createQueryBuilder('sub_contract_milestone')
      .leftJoinAndSelect('sub_contract_milestone.project', 'sub_contract_project')
      .where('sub_contract_project.id = :id', { id })
      .getMany();
    milestones.forEach(milestone => {
      delete milestone.project
    });
    return milestones;
  }

  findSubContractMilestoneById(id: string): Promise<SubContractMilestone> {
    return this.subContractMilestoneRepository.findOne({
      relations: ['project', 'project.project'],
      where: { id },
    });
  }

  saveSubContractMilestone(milestone: SubContractMilestone): Promise<SubContractMilestone> {
    return this.subContractMilestoneRepository.save(milestone);
  }

  createMilestones(subContract: SubContract): Promise<SubContractMilestone[]> {
    const sitePlan = subContract.sitePlan;
    const totalPrice = SubContractService.totalPriceFromSitePlan(sitePlan);
    const depositMilestone = new SubContractMilestone(subContract, SubContractMilestoneType.Deposit, totalPrice / 2, subContractMilestoneComment[SubContractMilestoneType.Deposit]);
    const finalMilestone = new SubContractMilestone(subContract, SubContractMilestoneType.Final, totalPrice / 2, subContractMilestoneComment[SubContractMilestoneType.Final]);
    return this.subContractMilestoneRepository.save([depositMilestone, finalMilestone]);
  }

  saveReturnedMaterials(materialReturns: MaterialReturn[]): Promise<MaterialReturn[]> {
    return this.materialReturnRepository.save(materialReturns);
  }
}
