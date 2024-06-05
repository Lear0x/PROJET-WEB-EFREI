import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { MessageService } from './message.service';
import { MessageInput } from './message.dto';

@Processor('message-queue')
export class MessageProcessor {
  constructor(private readonly messageService: MessageService) {}

  @Process('createMessage')
  async handleCreateMessage(job: Job<MessageInput>) {
    const messageData = job.data;
    await this.messageService.create(messageData);
  }
}
