import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Message } from '../message/message.model';

@Injectable()
export class BullMQService {
  constructor(@InjectQueue('message-queue') private readonly messageQueue: Queue) {}

  async addMessageJob(message: Message) {
    console.log('[bullmq.service] - addMessageJob() - Start');
    await this.messageQueue.add('message-job', message);
    console.log('[bullmq.service] - addMessageJob() - End');
  }
}
