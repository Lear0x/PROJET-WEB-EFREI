import { Module } from '@nestjs/common';
import { DateScalar } from '../common/date.scalar';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
 
@Module({
  providers: [MessageResolver, MessageService, DateScalar],
})
export class MessageModule {}