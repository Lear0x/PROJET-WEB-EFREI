import { Module } from '@nestjs/common';
import { DateScalar } from '../common/date.scalar';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';

@Module({
  providers: [ConversationResolver, ConversationService, DateScalar],
})
export class ConversationModule {}