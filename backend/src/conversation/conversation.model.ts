import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'conversation ' })
export class Conversation {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    title: string;

    @Field(type => [ID], { nullable: true }) // Liste d'identifiants de messages
    messageIds: string[];

    @Field(type => [User])
    users: User[];

    @Field(type => Int) 
    timestamp: number;
}
