import { Injectable } from "@nestjs/common";
import { Conversation } from "./conversation.model";
import { ConversationInput } from "./conversation.dto";

@Injectable()
export class ConversationService { 

    async create(conversation: ConversationInput): Promise<Conversation> {
        return {} as Conversation;
    }

    async findAll(): Promise<Conversation[]> {
        return [] as Conversation[];
    }

    async findOneById(id: string): Promise<Conversation> {
        return {} as Conversation;
    }

    async remove(id: string): Promise<boolean> {
        return true;
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        return [] as Conversation[];
    }

    async update(id: string, conversation: ConversationInput): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async findByTitle(title: string): Promise<Conversation[]> {
        return [] as Conversation[];
    }

    async addMessage(id: string, messageId: string): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async removeMessage(id: string, messageId: string): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async addUser(id: string, userId: string): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async removeUser(id: string, userId: string): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async addUsers(id: string, userIds: string[]): Promise<Conversation | null> {
        return {} as Conversation;
    }

    async removeUsers(id: string, userIds: string[]): Promise<Conversation | null> {
        return {} as Conversation;
    }

    


}