import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message as GraphQLMessage, Message } from './message.model';
import { Message as MongooseMessage, MessageSchema } from './message.schema';
import { MessageInput } from './message.dto';
import { toGraphQLMessage } from '../common/utils';
import { BullMQService } from '../bullmq/bullmq.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MongooseMessage>,
    private readonly bullMQService: BullMQService,
  ) {}

  async sendMessage(data: MessageInput): Promise<Message | null> {
    try {
      console.log('[message.service] - sendMessage() - Start')
      const newMessage = new this.messageModel(data);
      const savedMessage = await newMessage.save();
      const graphQLMessage = toGraphQLMessage(savedMessage);
      await this.bullMQService.addMessageJob(graphQLMessage);
      console.log('[message.service] - sendMessage() - End')
      return graphQLMessage;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async handleMessageJob(message: GraphQLMessage) {
    // Ajouter la logique de traitement du message ici
    console.log('Handling message:', message);
    // Exemple: envoyer le message via une API externe, une notification, etc.
  }

  async findAll(): Promise<GraphQLMessage[]> {
    const messages = await this.messageModel.find().exec();
    return messages.map(toGraphQLMessage);
  }

  async findOneById(id: string): Promise<GraphQLMessage> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return toGraphQLMessage(message);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByConversationId(conversationId: string): Promise<GraphQLMessage[]> {
    const messages = await this.messageModel.find({ conversation: conversationId }).exec();
    return messages.map(toGraphQLMessage);
  }

  async findByUserId(userId: string): Promise<GraphQLMessage[]> {
    const messages = await this.messageModel.find({ from: userId }).exec();
    return messages.map(toGraphQLMessage);
  }

  async update(id: string, messageInput: MessageInput): Promise<GraphQLMessage | null> {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(id, messageInput, { new: true }).exec();
    if (!updatedMessage) {
      return null;
    }
    return toGraphQLMessage(updatedMessage);
  }
}
