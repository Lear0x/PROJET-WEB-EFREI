import { Field, InputType, ID } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@InputType()
export class MessageInput {

    @Field()
    content: string;

    @Field()
    userId: string;

    @Field(type => ID)
    conversationId: string;
}