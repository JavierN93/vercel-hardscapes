import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProjectService } from '../project/project.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { SearchQueryDto } from './dtos/search-query.dto';
import { SearchResultDto } from './dtos/search-result.dto';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.Consultant, UserRole.SuperAdmin])
@Controller('api/search')
export class SearchController {

  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UsersService,
  ) {
  }

  @Post()
  @ApiOkResponse({ type: SearchResultDto })
  async search(@Body() query: SearchQueryDto): Promise<SearchResultDto> {
    const result = new SearchResultDto();
    if (!query.keyword) {
      return result;
    }
    result.projects = await this.projectService.findProjectsByKeyword(query.keyword);
    const users = await this.userService.findUsersByKeyword(query.keyword);
    result.customers = users.filter(x => x.role === UserRole.Customer).map(x => x.toUserDto());
    result.consultants = users.filter(x => x.role === UserRole.Consultant).map(x => x.toUserDto());
    return result;
  }

}
