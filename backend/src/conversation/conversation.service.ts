import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation, Conversation as GraphQLConversation } from './conversation.model';
import { Conversation as MongooseConversation } from './conversation.schema';
import { ConversationInput } from './conversation.dto';
import { toGraphQLConversation } from '../common/utils'; 
import { BlobOptions } from "buffer";

@Injectable()
export class ConversationService {
	constructor(
		@InjectModel('Conversation') private readonly conversationModel: Model<MongooseConversation>,
	) { }

	async create(data: ConversationInput): Promise<Conversation | null> {
		try {
			const newConv = new this.conversationModel(data);
			await newConv.save();
			return toGraphQLConversation(newConv);
		} catch (e) {
			console.error(e)
			return null;
		}

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


	async update(conv: Conversation): Promise<GraphQLConversation | null> {
		console.log("conv COnvServiceUpdate :", conv);
		const newConversation = new this.conversationModel(conv);
		console.log("newCOnv COnvServiceUpdate :", newConversation);
		newConversation.updateOne();
		if (!newConversation) {
			return null;
		}
		return toGraphQLConversation(newConversation);
	}

	async addMsgIdToConv(convId: string, msgId: string): Promise<GraphQLConversation | null> {
		try {
			console.log('convId =>', convId)
			const conv = await this.conversationModel.findOne({ _id: convId }).exec();
			if (conv) {
				conv.messagesIds.push(msgId);
				console.log('modifiedConv => ', JSON.stringify(conv));
				conv.save();
				return toGraphQLConversation(conv);

			} else {
				throw new NotFoundException();
			}
		} catch (e) {
			throw Error(e);
		}

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
