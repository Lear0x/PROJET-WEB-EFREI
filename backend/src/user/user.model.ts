import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Conversation } from '../conversation/conversation.model';

@ObjectType()
export class User {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    username: string;

    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string;

    @Field(type => Int)
    timeStamp: number;

    @Field(type => [Conversation], { nullable: true })
    conversations?: Conversation[] | null;

}
