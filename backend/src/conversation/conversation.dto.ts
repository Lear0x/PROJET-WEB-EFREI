import { Field, InputType, ID } from '@nestjs/graphql';


@InputType()
export class ConversationInput {
    @Field(type => String)
    title: string;

    @Field(type => [ID])
    userIds: string[];
}