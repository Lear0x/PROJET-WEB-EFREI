import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Conversation } from 'src/conversation/conversation.model';

@ObjectType({ description: 'user ' })
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

    @Field(type =>  [Conversation], { nullable: true })
    conversations?: Conversation[] | null;

}
