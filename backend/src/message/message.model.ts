import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Conversation } from 'src/conversation/conversation.model';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'message ' })
export class Message {

    @Field(type => ID)
    id: string;


    @Field(type => String)
    content: string;

    @Field(type => User)
    from: string;

    @Field(type => Conversation)
    conversation: Conversation;

    @Field(type => Date)
    timeStamp: Date;

}
