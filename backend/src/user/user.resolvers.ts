import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { UserInput } from './user.dto';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => User)
    async user(@Args('id') id: string): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

    @Query(() => [User], { name: 'users' })
    async getUsers(): Promise<User[]> {
      return this.userService.findAll();
    }

    @Mutation(() => Boolean)
    async createUser(@Args('data') data: UserInput): Promise<boolean> {
      return this.userService.create(data);
    }

    @Mutation(returns => Boolean)
    async removeUser(@Args('id')id : string) {
        return this.userService.remove(id);
    }

}