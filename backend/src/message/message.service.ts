import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message as GraphQLMessage, Message } from './message.model';
import { Message as MongooseMessage, MessageSchema } from './message.schema';
import { MessageInput } from './message.dto';
import { toGraphQLMessage } from '../common/utils'; // Assurez-vous d'importer la fonction de transformation correctement

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<MongooseMessage>,
  ) {}

  async create(data: MessageInput): Promise<Message | null> {
    
    try {
      const newMessage = new this.messageModel(data);
      await newMessage.save();
      return toGraphQLMessage(newMessage);
    }
    catch(e) {
      console.error(e)
      return null;
    }
    
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
