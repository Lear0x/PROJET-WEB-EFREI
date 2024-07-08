import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Conversation } from "./conversation.model";
import { ConversationService } from "./conversation.service";
import { ConversationInput } from "./conversation.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { UserService } from "../user/user.service";
import { error } from "console";

@Resolver(() => Conversation)
export class ConversationResolver {

    constructor(
        private readonly conversationService: ConversationService,
        private readonly userService: UserService,
    ) 
    {}
    
    @Mutation(() => Boolean)
    async createConversation(@Args('data') data: ConversationInput): Promise<Boolean> {
        try { 
          
            const usersExist = await Promise.all(data.userIds.map(userId => this.userService.findOneById(userId)));
            if (usersExist.some(user => !user)) {
                throw new Error("One user in the Users selected doesn't exist");
            }
            
            const convCreated = await this.conversationService.create(data);
            if (convCreated) {
                return await this.userService.addConvToUsers(data.userIds, convCreated.id);
            } else {
                throw new Error("Conversation not created");
            }
        } catch (e) {
            console.error(e);
            throw new BadRequestException(e.message);
        }
    }
    

	@Query(returns => [Conversation])
    async conversations(): Promise<Conversation[]> {
        return this.conversationService.findAll();
    }

	@Query(returns => Conversation)
    async conversation(@Args('id') id: string): Promise<Conversation> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }

        const conv = await this.conversationService.findOneById(id);
        if (!conv) {
            throw new NotFoundException(id);
        }
        return conv;
    }

	@Mutation(() => Boolean)
    async removeConversation(@Args('id') id: string): Promise<boolean> {
        
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }

        try {
            const conv = await this.conversationService.findOneById(id);
            if (!conv) {
                throw new NotFoundException(id);
            }
            const bool = await this.conversationService.remove(id);
            return bool ? true : false;
        } catch(e) {
            throw new NotFoundException;
        }
        
    }

	@Query(returns => [Conversation])
    async conversationByUserId(@Args('userId') userId: string): Promise<Conversation[]> {
        return this.conversationService.findByUserId(userId);
    }  

	@Query(returns=> [Conversation])
    async conversationByTitle(@Args('title') title: string): Promise<Conversation[]> {
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