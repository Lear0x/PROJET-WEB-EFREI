// conversation.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { ConversationSchema } from './conversation.schema';
import { MessageModule } from '../message/message.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Conversation', schema: ConversationSchema }, ]),
    MessageModule,
    UserModule
  ],
  providers: [ConversationService, ConversationResolver],
  exports: [ConversationService],
})
export class ConversationModule {}
