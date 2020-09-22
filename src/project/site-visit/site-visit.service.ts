import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SiteVisit } from './entities/site-visit.entity';
import { MachineAccessType } from '../enums';
import { UpdateSiteVisitDto } from './dtos/update-site-visit.dto';
import { saveDtoToRepository } from '../../common/utils/repository.util';

@Injectable()
export class SiteVisitService {
  constructor(
    @InjectRepository(SiteVisit) private siteVisitRepository: Repository<SiteVisit>,
  ) {
  }

  findSiteVisitById(id: string): Promise<SiteVisit> {
    return this.siteVisitRepository.findOne({ id });
  }

  findSiteVisitByProjectId(projectId: string): Promise<SiteVisit> {
    return this.siteVisitRepository.createQueryBuilder('siteVisit')
      .leftJoinAndSelect('siteVisit.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getOne();
  }

  async saveSiteVisit(siteVisit: SiteVisit): Promise<SiteVisit> {
    await this.siteVisitRepository.save(siteVisit);
    return this.findSiteVisitById(siteVisit.id);
  }

  async updateSiteVisit(siteVisit: SiteVisit, payload: UpdateSiteVisitDto): Promise<SiteVisit> {
    siteVisit = await saveDtoToRepository<SiteVisit>(payload, siteVisit || new SiteVisit(), this.siteVisitRepository);
    return this.findSiteVisitById(siteVisit.id);
  }

  getSiteVisitTemplate(): SiteVisit {
    const siteVisit = new SiteVisit();
    siteVisit.attachments = [];
    siteVisit.manufacturer = '';
    siteVisit.productName = '';
    siteVisit.preferredColors = [];
    siteVisit.preferredSize = '';
    siteVisit.preferredTexture = '';
    siteVisit.preferredPrice = '';
    siteVisit.additionalDesign = '';
    siteVisit.machineAccess = { type: MachineAccessType.NotSure, attachments: [], comment: '' };
    siteVisit.soil = { type: null, attachments: [], comment: '' };
    siteVisit.propertyGrade = { type: null, attachments: [], comment: '' };
    siteVisit.drainage = { type: null, attachments: [], comment: '' };
    siteVisit.exteriorUtilities = { attachments: [], comment: '' };
    siteVisit.exteriorHazards = { attachments: [], comment: '' };
    siteVisit.exteriorInconveniences = { attachments: [], comment: '' };
    siteVisit.materialStorage = { attachments: [], comment: '' };
    siteVisit.materialHaulOut = { attachments: [], comment: '' };
    siteVisit.downspouts = { attachments: [], comment: '' };
    siteVisit.shrubRemoval = { attachments: [], comment: '' };
    return siteVisit;
  }
}
