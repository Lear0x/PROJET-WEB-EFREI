import { Field, InputType, ID } from '@nestjs/graphql';
 
@InputType()
export class ConversationInput {
    @Field()
    title: string;

    @Field()
    userIds: string[];
}