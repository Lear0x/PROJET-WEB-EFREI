import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

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

    @Field(type => [ID])
    conversationsIds?: string[];

}
