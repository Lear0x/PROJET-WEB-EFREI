import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';
import { MessageInput } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async create(messageInput: MessageInput): Promise<Message> {
    const newMessage = new this.messageModel({
      ...messageInput,
      timeStamp: new Date(),
    });
    return newMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOneById(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return this.messageModel.find({ conversation: conversationId }).exec();
  }

  async findByUserId(userId: string): Promise<Message[]> {
    return this.messageModel.find({ from: userId }).exec();
  }

  async update(id: string, messageInput: MessageInput): Promise<Message | null> {
    return this.messageModel.findByIdAndUpdate(id, messageInput, { new: true }).exec();
  }
}
