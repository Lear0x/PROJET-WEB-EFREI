import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class MessageInput {

    @Field()
    content: string;

    @Field()
    from: string;

    @Field(type => ID)
    conversationId: string;
}