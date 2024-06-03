import { Resolver } from "@nestjs/graphql";
import { Conversation } from "./conversation.model";
import { ConversationService } from "./conversation.service";
import { MessageService } from "../message/message.service";
import { ConversationInput } from "./conversation.dto";

@Resolver(() => Conversation)
export class ConversationResolver {

    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService) 
    {}
    
    async createConversation(conversation: ConversationInput): Promise<Conversation> {
        return this.conversationService.create(conversation);
    }

    async conversations(): Promise<Conversation[]> {
        return this.conversationService.findAll();
    }

    async conversation(id: string): Promise<Conversation> {
        return this.conversationService.findOneById(id);
    }

    async removeConversation(id: string): Promise<boolean> {
        return this.conversationService.remove(id);
    }

    async conversationByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationService.findByUserId(userId);
    }  

    async conversationByTitle(title: string): Promise<Conversation[]> {
        return this.conversationService.findByTitle(title);
    }

    async addMessageToConversation(id: string, messageId: string): Promise<Conversation | null> {
        return this.conversationService.addMessage(id, messageId);
    }

    async removeMessageFromConversation(id: string, messageId: string): Promise<Conversation | null> {
        return this.conversationService.removeMessage(id, messageId);
    }

    async updateConversation(id: string, conversation: ConversationInput): Promise<Conversation | null> {
        return this.conversationService.update(id, conversation);
    }
    
    async addUserToConversation(id: string, userId: string): Promise<Conversation | null> {
        return this.conversationService.addUser(id, userId);
    }

    async removeUserFromConversation(id: string, userId: string): Promise<Conversation | null> {
        return this.conversationService.removeUser(id, userId);
    }

    async addUsersToConversation(id: string, userIds: string[]): Promise<Conversation | null> {
        return this.conversationService.addUsers(id, userIds);
    }

    async removeUsersFromConversation(id: string, userIds: string[]): Promise<Conversation | null> {
        return this.conversationService.removeUsers(id, userIds);
    }

    
}