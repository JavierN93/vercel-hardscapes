import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { Lead } from './entities/lead.entity';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    SlackModule,
  ],
  providers: [
    LeadService,
  ],
  controllers: [
    LeadController
  ],
  exports: [
    LeadService
  ]
})
export class LeadModule {}
