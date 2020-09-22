import { ApiProperty } from '@nestjs/swagger';

import { Project } from '../../project/entities/project.entity';
import { UserDto } from '../../auth/dtos/user.dto';

export class SearchResultDto {

  @ApiProperty({ type: Project, isArray: true })
  projects: Project[];

  @ApiProperty({ type: UserDto, isArray: true })
  customers: UserDto[];

  @ApiProperty({ type: UserDto, isArray: true })
  consultants: UserDto[];

  constructor() {
    this.projects = [];
    this.customers = [];
    this.consultants = [];
  }
}
