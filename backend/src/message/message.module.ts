// message.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageSchema } from './message.schema';
import { MessageResolver } from './message.resolver';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '../user/user.service';
import { ConversationSchema } from '../conversation/conversation.schema';
import { UserSchema } from '../user/user.schema';
import { BullMQModule } from '../bullmq/bullmq.module';
import { MessageProcessor } from './message.processor';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }, { name: 'Conversation', schema: ConversationSchema }, { name: 'User', schema: UserSchema }]), BullMQModule],
  providers: [MessageService, MessageResolver, ConversationService, UserService, MessageProcessor],
  exports: [MessageService],
})
export class MessageModule {}
