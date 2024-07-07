import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { ConversationSchema } from '../conversation/conversation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Conversation', schema: ConversationSchema }]), ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}