import { Field, InputType, ID } from '@nestjs/graphql';
import { Conversation } from 'src/conversation/conversation.model';

@InputType()
export class MessageInput {

    @Field()
    content: string;

    @Field(type => ID)
    userId: string;

    @Field(type => Conversation)
    conversation: Conversation;
}