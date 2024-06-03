import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;

}
