import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './conversation.schema';
import { ConversationInput } from './conversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation') private readonly conversationModel: Model<Conversation>,
  ) {}

  async create(conversation: ConversationInput): Promise<Conversation> {
    const newConversation = new this.conversationModel(conversation);
    return newConversation.save();
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async findOneById(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.conversationModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ users: userId }).exec();
  }

  async update(id: string, conversation: ConversationInput): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(id, conversation, { new: true }).exec();
  }

  async findByTitle(title: string): Promise<Conversation[]> {
    return this.conversationModel.find({ title }).exec();
  }

  async addMessage(id: string, messageId: string): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { messages: messageId } },
      { new: true },
    ).exec();
  }

  async removeMessage(id: string, messageId: string): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { messages: messageId } },
      { new: true },
    ).exec();
  }

  async addUser(id: string, userId: string): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { users: userId } },
      { new: true },
    ).exec();
  }

  async removeUser(id: string, userId: string): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { users: userId } },
      { new: true },
    ).exec();
  }

  async addUsers(id: string, userIds: string[]): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { users: { $each: userIds } } },
      { new: true },
    ).exec();
  }

  async removeUsers(id: string, userIds: string[]): Promise<Conversation | null> {
    return this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { users: { $in: userIds } } },
      { new: true },
    ).exec();
  }
}
