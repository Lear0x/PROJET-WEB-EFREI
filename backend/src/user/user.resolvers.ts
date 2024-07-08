import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserInput } from './user.dto';
import { Types } from 'mongoose';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => User)
    async user(@Args('id') id: string): Promise<User> {
		
		if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }

	@Query(() => [User], { name: 'users' })
	async getUsers(): Promise<User[]> {
		try {
			const users = await this.userService.findAll();
			return users;
		} catch (e) {	
			console.error();
			throw new Error(e);
		}
	}

	@Mutation(() => Boolean)
    async createUser(@Args('data') data: UserInput): Promise<boolean | undefined> {
        try {
            const resultEmail = await this.userService.findOneByEmail(data.email);
            const resultUsername = await this.userService.findOneByUsername(data.username);

            if (!data.email) {
                throw new BadRequestException('Missing input fields');
            }

            if (!resultEmail && !resultUsername) {
                console.log('dataemail', data.email);
                const resultDataMail = await this.userService.checkExists(data.email);
                console.log('resultdatamail', resultDataMail);
                if (!resultDataMail) {
					const userCreated = await this.userService.create(data);
                    return userCreated;
                } else {
                    throw new Error('User already exists');
                }
            } else {
                throw new Error('User already exists');
            }
        } catch (e) {
            throw new Error(e);
        }
    }


    @Mutation(() => Boolean)
    async removeUser(@Args('id')id : string) : Promise<Boolean>{
		
		if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }

		try {
			if (!this.userService.findOneById(id)) {
				throw new NotFoundException;
			}
			const bool = await this.userService.remove(id);
			return bool ? true : false;
		} catch (e) {
			throw new NotFoundException;
		}
	}

}