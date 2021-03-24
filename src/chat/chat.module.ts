import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { SocketModule } from '../socket/socket.module';
import { LoggerModule } from '../logger/logger.module';

import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    ProjectModule,
    SocketModule,
    LoggerModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
