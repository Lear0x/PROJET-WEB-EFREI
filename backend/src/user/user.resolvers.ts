import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

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

    @Query(returns => [User])
    async users(): Promise<User[]> {
        const users = await this.userService.findAll();
        if(!users) {
            throw new NotFoundException();
        }

        return users;
    }

    @Mutation(returns => User)
    async createUser(@Args('username')username : string, @Args('password')password : string, @Args('email')email : string  ) {
        return this.userService.create( {
            email: email,
            password: password,
            timeStamp: Date.now(),
            username: username,
            id: ''
        })
    }

    @Mutation(returns => User)
    async removeUser(@Args('id')id : string) {
        return this.userService.remove(id);
    }

}