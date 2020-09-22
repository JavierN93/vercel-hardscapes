import { Module } from '@nestjs/common';

import { ConsultantController } from './consultant.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ConsultantController],
})
export class ConsultantModule {
}
