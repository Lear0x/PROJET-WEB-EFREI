import { Module } from '@nestjs/common';
import { DateScalar } from '../common/date.scalar';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { BullModule } from '@nestjs/bull';
import { MessageProcessor } from './message.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  providers: [MessageResolver, MessageService, DateScalar, MessageProcessor],
})
export class MessageModule {}