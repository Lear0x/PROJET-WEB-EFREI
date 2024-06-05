// message.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageSchema } from './message.schema';
import { MessageResolver } from './message.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
