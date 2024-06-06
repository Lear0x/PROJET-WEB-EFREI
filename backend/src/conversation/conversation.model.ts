import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType()
export class Conversation {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    title: string;

    @Field(type => [ID], { nullable: true }) // Liste d'identifiants de messages
    messageIds: string[];

    @Field(type => [ID])
    userIds: string[];

    @Field(type => Int) 
    timestamp: number;
}
