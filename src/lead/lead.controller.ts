import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { defaultTakeCount } from '../common/constants/general.constants';
import { ArchivedType, SortByDateType } from '../common/enums/query.enum';
import { LeadDto } from './dtos/lead.dto';
import { QueryLeadsDto } from './dtos/query-leads.dto';
import { LeadService } from './lead.service';
import { SuccessResponse } from '../common/models/success-response';
import { LeadStatus, LeadType } from './enums';
import { ExternalContactRequestDto } from './dtos/external-contact-request.dto';
import { getFromDto } from '../common/utils/repository.util';
import { Lead } from './entities/lead.entity';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';
import { SlackService } from '../slack/slack.service';

@ApiTags('Lead')
@ApiBearerAuth()
@Controller('api')
export class LeadController {

  constructor(
    private readonly leadService: LeadService,
    private readonly slackService: SlackService,
  ) {
  }

  @Get('lead/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @ApiOkResponse({ type: LeadDto, isArray: true })
  async leads(@Query() query: QueryLeadsDto): Promise<PaginatorDto<LeadDto>> {
    const [result, count] = await this.leadService.findAll(query.skip || 0,
      query.take || defaultTakeCount,
      query.sortByDate || SortByDateType.MostRecent,
      query.archivedType === ArchivedType.Archived ? LeadStatus.Archived : null);
    return { data: result.map(r => r.toDto()), count };
  }

  @Get('lead/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Consultant])
  @ApiOkResponse({ type: LeadDto })
  async lead(@Param('id') id: string): Promise<LeadDto> {
    const lead = await this.leadService.findLeadById(id);
    return lead.toDto();
  }

  @Put('lead/:id')
  @ApiOkResponse({ type: () => LeadDto })
  async updateLead(@Param('id') id: string, @Body() payload: LeadDto): Promise<LeadDto> {
    const updated = await this.leadService.updateLeadById(id, payload);
    return updated.toDto();
  }

  @Post('lead/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: () => SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: false })
  async archive(@Param('id') id: string): Promise<SuccessResponse> {
    await this.leadService.updateLeadStatusById(id, LeadStatus.Archived);
    return new SuccessResponse(true);
  }

  @Post('contact')
  @ApiOkResponse({ type: SuccessResponse })
  async contact(@Body() body: ExternalContactRequestDto): Promise<SuccessResponse> {
    const lead = getFromDto<Lead>(body, new Lead())
    lead.type = LeadType.ContactUs;
    const data = await this.leadService.add(lead);
    try {
      await this.slackService.sendNotification(SlackMessageType.SendContactUsMessage, data);
    } catch (e) {
      console.log('contact us message error: ' + e);
    }
    return new SuccessResponse(true);
  }
}
