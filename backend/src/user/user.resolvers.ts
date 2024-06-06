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
    async getUsers(): Promise<User[] | null> {
		try {
			return this.userService.findAll();
		} catch (e) {	
			console.error();
			throw new Error(e);
		}
    }

    @Mutation(() => Boolean)
    async createUser(@Args('data') data: UserInput): Promise<boolean> {
		try {
			if(await this.userService.findOneByEmail(data.email) && await this.userService.findOneByUsername(data.username)){
				return await this.userService.create(data);
			} else {
				throw new Error('User already exists');
			}
		} catch (e) {
			console.error();
			throw new Error(e);
		}
    }

    @Mutation(() => Boolean)
    async removeUser(@Args('id')id : string) : Promise<Boolean>{
		try {
			if (!this.userService.findOneById(id)) {
				throw new NotFoundException(id);
			}
			const bool = await this.userService.remove(id);
			return bool ? true : false;
		} catch (e) {
			console.error();
			throw new Error(e);
		}
	}

}