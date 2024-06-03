import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/message/message.model';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'conversation ' })
export class Conversation {

    @Field(type => ID)
    id: string;

    @Field(type => [String])
    title: string;

    @Field(type => [Message])
    messages: Message;

    @Field(type => [User])
    users: User[];

    @Field(type => Date) 
    timestamp: Date
}
