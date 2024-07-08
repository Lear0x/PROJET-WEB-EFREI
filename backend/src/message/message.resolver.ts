import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageInput } from './message.dto';
import { MessageService } from './message.service';
import { NotFoundException } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { error } from 'console';
import { UserService } from '../user/user.service';


@Resolver(() => Message)
export class MessageResolver {

    constructor(
        private readonly messageService: MessageService, 
        private readonly conversationService: ConversationService,
        private readonly userService: UserService
    ) { }

    
    @Mutation(() => Boolean)
    async sendMessage(@Args('data') data: MessageInput): Promise<boolean> {
        const conv = await this.conversationService.findOneById(data.conversationId);
        if(conv && await this.userService.findOneById(data.from)) {
            const messageCreated = await this.messageService.sendMessage(data);
            if(messageCreated) {
                try {
                    await this.conversationService.addMsgIdToConv(conv.id, messageCreated.id);
                    return true;
                }
                catch(e) {
                    throw error(e);
                }       
            }
            else {
                throw error ("message not created")
            }
        }
        else {
            throw error("The conversation doesnt exist");
        }    
    }

    @Mutation(returns => Message)
    async updateMessage(@Args('id') id: string, @Args('messageInput') messageInput: MessageInput): Promise<Message | null> {
        return this.messageService.update(id, messageInput);
    }

    @Mutation(returns => Boolean)
    async removeMessage(@Args('id') id: string): Promise<boolean> {
        return this.messageService.remove(id);
    }

    @Query(() => [Message], { name: 'messages' })
    async getMessages(): Promise<Message[]> {
      return this.messageService.findAll();
    }

    @Query(() => Message)
    async message(@Args('id') id: string): Promise<Message> {
        const message = await this.messageService.findOneById(id);
        if (!message) {
            throw new NotFoundException(id);
        }
        return message;
    }

    @Query(() => [Message])
    async messagesByConversationId(@Args('conversationId') conversationId: string): Promise<Message[]> {
        return this.messageService.findByConversationId(conversationId);
    }

    @Query(() => [Message])
    async messagesByUserId(@Args('userId') userId: string): Promise<Message[]> {
        return this.messageService.findByUserId(userId);
    }
    
}
