import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MessageService } from './message.service';

@Processor('message-queue')
export class MessageProcessor extends WorkerHost {
  constructor(private readonly messageService: MessageService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    console.log('[message.processor] - process() - start');
    const messageData = job.data;
    await this.messageService.handleMessageJob(messageData);
    console.log('[message.processor] - process() - End');
    return { success: true, message: `Message processed: ${messageData.content}` };
  }
}
