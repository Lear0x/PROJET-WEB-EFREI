import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType({ description: 'message ' })
export class Message {
    @Field(type => ID)
    id: string;

    @Field(type => String)
    content: string;

    @Field(type => User)
    from: User;

    @Field(type => ID)
    conversationId: string; // Référence à la conversation

    @Field()
    timeStamp: number;
}
