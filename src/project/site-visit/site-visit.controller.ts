import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { SiteVisitService } from './site-visit.service';
import { ProjectService } from '../project.service';
import { SiteVisit } from './entities/site-visit.entity';
import { UpdateSiteVisitDto } from './dtos/update-site-visit.dto';

@ApiTags('Site Visit')
@Controller('api/project')
export class SiteVisitController {

  constructor(
    private siteVisitService: SiteVisitService,
    private projectService: ProjectService,
  ) {
  }

  @Get(':projectId/site-visit')
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => SiteVisit })
  @ApiParam({ name: 'projectId', required: true })
  async projectSiteVisit(@Param('projectId') projectId: string): Promise<SiteVisit> {
    const siteVisit = await this.siteVisitService.findSiteVisitByProjectId(projectId);
    return siteVisit || this.siteVisitService.getSiteVisitTemplate();
  }

  @Post(':projectId/site-visit')
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => SiteVisit })
  async updateSiteVisit(@Param('projectId') projectId: string, @Body() payload: UpdateSiteVisitDto): Promise<SiteVisit> {
    const project = await this.projectService.findProjectById(projectId);
    let siteVisit = await this.siteVisitService.findSiteVisitByProjectId(projectId);
    siteVisit = await this.siteVisitService.updateSiteVisit(siteVisit, payload);
    project.siteVisit = siteVisit;
    await this.projectService.saveProject(project);
    return siteVisit;
  }
}
