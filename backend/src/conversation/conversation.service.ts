import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation as GraphQLConversation } from './conversation.model';
import { Conversation as MongooseConversation } from './conversation.schema';
import { ConversationInput } from './conversation.dto';
import { toGraphQLConversation } from '../common/utils'; // Assurez-vous d'importer la fonction de transformation correctement

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation') private readonly conversationModel: Model<MongooseConversation>,
  ) {}

  async create(conversationInput: ConversationInput): Promise<GraphQLConversation> {
    const newConversation = new this.conversationModel(conversationInput);
    const savedConversation = await newConversation.save();
    return toGraphQLConversation(savedConversation);
  }

  async findAll(): Promise<GraphQLConversation[]> {
    const conversations = await this.conversationModel.find().exec();
    return conversations.map(toGraphQLConversation);
  }

  async findOneById(id: string): Promise<GraphQLConversation> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return toGraphQLConversation(conversation);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.conversationModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByUserId(userId: string): Promise<GraphQLConversation[]> {
    const conversations = await this.conversationModel.find({ users: userId }).exec();
    return conversations.map(toGraphQLConversation);
  }

  async update(id: string, conversationInput: ConversationInput): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(id, conversationInput, { new: true }).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async findByTitle(title: string): Promise<GraphQLConversation[]> {
    const conversations = await this.conversationModel.find({ title }).exec();
    return conversations.map(toGraphQLConversation);
  }

  async addMessage(id: string, messageId: string): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { messages: messageId } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async removeMessage(id: string, messageId: string): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { messages: messageId } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async addUser(id: string, userId: string): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { users: userId } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async removeUser(id: string, userId: string): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { users: userId } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async addUsers(id: string, userIds: string[]): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $push: { users: { $each: userIds } } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }

  async removeUsers(id: string, userIds: string[]): Promise<GraphQLConversation | null> {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { $pull: { users: { $in: userIds } } },
      { new: true },
    ).exec();
    if (!updatedConversation) {
      return null;
    }
    return toGraphQLConversation(updatedConversation);
  }
}
