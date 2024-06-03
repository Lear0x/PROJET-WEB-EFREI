import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { MessageInput } from './message.dto';

@Injectable()
export class MessageService {
    private messages: Message[] = [];

    async create(messageInput: MessageInput): Promise<Message> {
        const message: Message = {
            id: Math.random().toString(),
            content: messageInput.content,
            timeStamp: new Date(),
            userId: messageInput.userId,
            conversation: messageInput.conversation
        };
        this.messages.push(message);
        return message;
    }

    async findAll(): Promise<Message[]> {
        return this.messages as Message[];
    }

    async findOneById(id: string): Promise<Message> {
        return this.messages.find(message => message.id === id) as Message;
    }

    async remove(id: string): Promise<boolean> {
        const messageIndex = this.messages.findIndex(message => message.id === id);
        if (messageIndex === -1) {
            return false;
        }
        this.messages.splice(messageIndex, 1);
        return true;
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        return this.messages.filter(message => message.conversation.id === conversationId);
    }

    async findByUserId(userId: string): Promise<Message[]> {
        return this.messages.filter(message => message.userId === userId);
    }

    async update(id: string, messageInput: MessageInput): Promise<Message | null>{
        const messageIndex = this.messages.findIndex(message => message.id === id);
        if (messageIndex === -1) {
            return null;
        }
        this.messages[messageIndex] = {
            ...this.messages[messageIndex],
            ...messageInput
        };
        return this.messages[messageIndex];
    }
}
