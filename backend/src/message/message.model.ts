import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Message {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    content: string;

    @Field(type => String)
    from: string;

    @Field(type => ID)
    conversationId: string; // Référence à la conversation

    @Field()
    timeStamp: number;
}
