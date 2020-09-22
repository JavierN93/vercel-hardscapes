import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { JobsModule } from '../jobs/jobs.module';
import { IdeaBoardModule } from '../idea-board/idea-board.module';
import { ProjectModule } from '../project/project.module';

import { SeedService } from './seed.service';

@Module({
  providers: [
    SeedService,
  ],
  imports: [
    UsersModule,
    JobsModule,
    IdeaBoardModule,
    ProjectModule,
  ],
})
export class SeedModule {
}
