import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { SlackModule } from '../slack/slack.module';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { ContractorProfile } from '../users/entities/contractor-profile.entity';

@Module({
  controllers: [ContractorController],
  imports: [
    TypeOrmModule.forFeature([ContractorProfile]),
    EmailModule,
    UsersModule,
    PortfolioModule,
    NotificationModule,
    SlackModule,
  ],
  providers: [ContractorService],
})
export class ContractorModule {
}
