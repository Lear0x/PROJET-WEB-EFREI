import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Conversation } from "./conversation.model";
import { ConversationService } from "./conversation.service";
import { MessageService } from "../message/message.service";
import { ConversationInput } from "./conversation.dto";
import { NotFoundException } from "@nestjs/common";

@Resolver(() => Conversation)
export class ConversationResolver {

    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService) 
    {}
    
	@Mutation(() => Boolean)
    async createConversation(@Args('data') data: ConversationInput): Promise<boolean> {
        return this.conversationService.create(data);
    }

	@Query(returns => [Conversation])
    async conversations(): Promise<Conversation[]> {
        return this.conversationService.findAll();
    }

	@Query(returns => Conversation)
    async conversation(@Args('id') id: string): Promise<Conversation> {
        const conversation = await this.conversationService.findOneById(id);
        if (!conversation) {
            throw new NotFoundException(id);
        }
        return conversation;
    }

	@Query(returns => Boolean)
    async removeConversation(id: string): Promise<boolean> {
        return this.conversationService.remove(id);
    }

	@Query(returns => [Conversation])
    async conversationByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationService.findByUserId(userId);
    }  

	@Query(returns=> [Conversation])
    async conversationByTitle(title: string): Promise<Conversation[]> {
        return this.conversationService.findByTitle(title);
    }

	// @Query(returns => Boolean)
    // async updateConversation(id: string, conversation: ConversationInput): Promise<Conversation | null> {
    //     return this.conversationService.update(conversation);
    // }
    
	// @Query(returns => Boolean)
    // async addUserToConversation(id: string, userId: string): Promise<Conversation | null> {
    //     return this.conversationService.addUser(id, userId);
    // }

	// @Query(returns => Boolean)
    // async removeUserFromConversation(id: string, userId: string): Promise<Conversation | null> {
    //     return this.conversationService.removeUser(id, userId);
    // }

	// @Query(returns => Boolean)
    // async addUsersToConversation(id: string, userIds: string[]): Promise<Conversation | null> {
    //     return this.conversationService.addUsers(id, userIds);
    // }

	// @Query(returns => Boolean)
    // async removeUsersFromConversation(id: string, userIds: string[]): Promise<Conversation | null> {
    //     return this.conversationService.removeUsers(id, userIds);
    // }

    
}