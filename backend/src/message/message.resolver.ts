import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Message } from './message.model';
import { MessageInput } from './message.dto';
import { MessageService } from './message.service';
import { NotFoundException } from '@nestjs/common';


@Resolver(() => Message)
export class MessageResolver {

    constructor(private readonly messageService: MessageService) { }

    @Mutation(returns => Message)
    async createMessage(@Args('messageInput') messageInput: MessageInput): Promise<Message> {
        return this.messageService.create(messageInput);
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
