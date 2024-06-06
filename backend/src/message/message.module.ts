// message.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageSchema } from './message.schema';
import { MessageResolver } from './message.resolver';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';
import { ConversationSchema } from 'src/conversation/conversation.schema';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }, { name: 'Conversation', schema: ConversationSchema }, { name: 'User', schema: UserSchema }])],
  providers: [MessageService, MessageResolver, ConversationService, UserService],
  exports: [MessageService],
})
export class MessageModule {}
