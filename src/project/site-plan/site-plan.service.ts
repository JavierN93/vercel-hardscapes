import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SitePlan } from '../../contractor/entities/site-plan.entity';
import { CustomPaymentItem } from '../../contractor/entities/custom-payment-item.entity';
import { CostItem } from '../../contractor/entities/cost-item.entity';
import { SitePlanDto } from './dtos/site-plan.dto';
import { getFromDto } from '../../common/utils/repository.util';
import { FinalProposal } from '../final-proposal/entities/final-proposal.entity';
import { AccessoryMaterialDetail } from '../../contractor/entities/accessory-material-detail.entity';

@Injectable()
export class SitePlanService {
  constructor(
    @InjectRepository(SitePlan) private sitePlanRepository: Repository<SitePlan>,
    @InjectRepository(CostItem) private costItemRepository: Repository<CostItem>,
    @InjectRepository(CustomPaymentItem) private customPaymentItemRepository: Repository<CustomPaymentItem>,
    @InjectRepository(AccessoryMaterialDetail) private accessoryMaterialDetailRepository: Repository<AccessoryMaterialDetail>,
  ) {
  }

  findBySubContractId(id: string): Promise<SitePlan> {
    return this.sitePlanRepository.createQueryBuilder('site_plan')
      .leftJoinAndSelect('site_plan.project', 'sub_contract')
      .leftJoinAndSelect('site_plan.costItems', 'costItems')
      .leftJoinAndSelect('site_plan.customPaymentItems', 'customPaymentItems')
      .leftJoinAndSelect('site_plan.accessoryMaterialDetails', 'accessoryMaterialDetails')
      .where('sub_contract.id = :id', { id })
      .getOne();
  }

  findById(id: string): Promise<SitePlan> {
    return this.sitePlanRepository.findOne({ relations: ['costItems', 'customPaymentItems', 'accessoryMaterialDetails'], where: { id } });
  }

  async saveFromDto(dto: SitePlanDto, sitePlan: SitePlan): Promise<SitePlan> {
    sitePlan = getFromDto<SitePlan>(dto, sitePlan || new SitePlan());
    if (!sitePlan.id) { delete sitePlan.id; }

    const costItems = dto.costItems.map(costItemDto => {
      const item = getFromDto<CostItem>(costItemDto, new CostItem());
      if (!item.id) { delete item.id; }
      return item;
    });
    sitePlan.costItems = await this.costItemRepository.save(costItems);

    const customPaymentItems = dto.customPaymentItems.map(customPaymentItemDto => {
      const item = getFromDto<CustomPaymentItem>(customPaymentItemDto, new CustomPaymentItem());
      if (!item.id) { delete item.id; }
      return item;
    });
    sitePlan.customPaymentItems = await this.customPaymentItemRepository.save(customPaymentItems);

    const accessoryMaterialDetailItems = dto.accessoryMaterialDetails.map(dto => {
      const item = getFromDto<AccessoryMaterialDetail>(dto, new AccessoryMaterialDetail());
      if (!item.id) { delete item.id; }
      return item;
    });
    sitePlan.accessoryMaterialDetails = await this.accessoryMaterialDetailRepository.save(accessoryMaterialDetailItems);
    sitePlan = await this.sitePlanRepository.save(sitePlan);
    return this.findById(sitePlan.id);
  }

  getEmptySitePlan(finalProposal: FinalProposal): SitePlan {
    const sitePlan = new SitePlan();
    sitePlan.brief = finalProposal.project.comment;
    sitePlan.existingSiteAssessment = finalProposal.existingSiteAssessment;
    sitePlan.costItems = finalProposal.costEstimates.filter(costItem => costItem.accept).map(costEstimate => {
      const costItem = new CostItem();
      costItem.comment = costEstimate.comment;
      costItem.cost = costEstimate.cost;
      costItem.type = costEstimate.type;

      return costItem;
    });
    sitePlan.accessoryMaterialDetails = finalProposal.costEstimates.filter(costItem => costItem.accept).map(costEstimate => {
      const accessoryMaterialDetail = new AccessoryMaterialDetail();
      accessoryMaterialDetail.type = costEstimate.type;
      accessoryMaterialDetail.materials = [];
      accessoryMaterialDetail.comment = '';
      accessoryMaterialDetail.attachments = [];
      return accessoryMaterialDetail;
    });
    sitePlan.customPaymentItems = [];
    sitePlan.discount = 0;
    sitePlan.startDate = finalProposal.startDate;
    sitePlan.endDate = finalProposal.endDate;
    sitePlan.comment = '';
    return sitePlan;
  }
}
