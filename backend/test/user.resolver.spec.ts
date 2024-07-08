import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../src/user/user.resolvers';
import { UserService } from '../src/user/user.service';
import { User } from '../src/user/user.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserInput } from '../src/user/user.dto';
import { User as SchemaUser } from '../src/user/user.schema'; 

describe('UserResolver', () => {
	let resolver: UserResolver;
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserResolver,
				{
					provide: UserService,
					useValue: {
            			findAll: jest.fn(),
						findOneById: jest.fn(),
						findOneByEmail: jest.fn(),
						findOneByUsername: jest.fn(),
						create: jest.fn(),
						remove: jest.fn(),
						checkExists: jest.fn(),
					},
				},
			],
		}).compile();

		resolver = module.get<UserResolver>(UserResolver);
		userService = module.get<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});

	describe('user', () => {
		it('should throw BadRequestException for an invalid ID', async () => {
			const invalidId = '123';

			await expect(resolver.user(invalidId)).rejects.toThrow(BadRequestException);
			await expect(resolver.user(invalidId)).rejects.toThrow(`Invalid ID format: ${invalidId}`);
		});

		it('should throw NotFoundException if user not found', async () => {
			const validId = new Types.ObjectId().toString();
			jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(null);

			await expect(resolver.user(validId)).rejects.toThrow(NotFoundException);
			await expect(resolver.user(validId)).rejects.toThrow(validId);
		});

		it('should return a user if found', async () => {
			const validId = new Types.ObjectId().toString();
			const mockUser = {
				id: validId,
				username: 'testuser',
				email: 'testuser@example.com',
				password: 'password',
				timeStamp: Date.now(),
			};
		
			jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(Promise.resolve(mockUser as SchemaUser | null | undefined));
		
			const result = await resolver.user(validId);
			expect(result).toEqual(mockUser);
		});
	});

	describe('createUser', () => {
		it('should throw error if user already exists', async () => {
			const existingUser: User = {
				id: '1',
				username: 'existinguser',
				email: 'existing@example.com',
				password: 'password',
				timeStamp: Date.now(),
				conversations: []
			};
			const mockUserData: UserInput = {
				username: 'existinguser',
				email: 'existing@example.com',
				password: 'password',
			};

			jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(Promise.resolve(existingUser as SchemaUser | null | undefined));
			jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(Promise.resolve(existingUser as SchemaUser | null | undefined));

			await expect(resolver.createUser(mockUserData)).rejects.toThrowError('User already exists');
		});

		it('should create a user if user does not exist', async () => {
			const mockUserData: UserInput = {
				username: 'newuser11111',
				email: 'newuser1111@example.com',
				password: 'password',
			};

			jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);
            jest.spyOn(userService, 'findOneByUsername').mockResolvedValueOnce(null);
            jest.spyOn(userService, 'checkExists').mockResolvedValueOnce(false);
            jest.spyOn(userService, 'create').mockResolvedValueOnce(true);

			const result = await resolver.createUser(mockUserData);

			expect(userService.create).toHaveBeenCalledWith(mockUserData);
			expect(result).toBe(true);
		});
	});

	describe('removeUser', () => {
		it('should throw BadRequestException for an invalid ID', async () => {
			const invalidId = '123';

			await expect(resolver.removeUser(invalidId)).rejects.toThrow(BadRequestException);
			await expect(resolver.removeUser(invalidId)).rejects.toThrow(`Invalid ID format: ${invalidId}`);
		});

		it('should throw NotFoundException if user not found', async () => {
			const validId = new Types.ObjectId().toString();

			await expect(resolver.removeUser(validId)).rejects.toThrow(NotFoundException);
			await expect(resolver.removeUser(validId)).rejects.toThrow("Not Found");
		});

		it('should remove a user if found', async () => {
			const validId = new Types.ObjectId().toString();

			const mockUser = {
				id: validId,
				username: 'testuser',
				email: 'testuser@example.com',
				password: 'password',
				timeStamp: Date.now(),
			};

			//await resolver.removeUser(validId);

			//expect(userService.remove).toHaveBeenCalledWith(validId);

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(Promise.resolve(mockUser as SchemaUser | null | undefined));
      jest.spyOn(userService, 'remove').mockResolvedValueOnce(Promise.resolve(mockUser as SchemaUser | null | undefined));

      const result = await resolver.removeUser(validId);
			expect(result).toEqual(true);
		});
	});

	describe('getUsers', () => {
		it('should return an array of users', async () => {
			const mockUsers: any[] = [
				{
					id: new Types.ObjectId().toString(),
					username: 'user1',
					email: 'user1@example.com',
					password: 'password',
					timeStamp: Date.now(),
				},
				{
					id: new Types.ObjectId().toString(),
					username: 'user2',
					email: 'user2@example.com',
					password: 'password',
					timeStamp: Date.now(),
				}
			];

			jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockUsers);

			const result = await resolver.getUsers();
			expect(result).toEqual(mockUsers);
		});

		it('should return an empty array if no users found', async () => {
			const mockEmptyUsers = [] as SchemaUser[] | Promise<SchemaUser[]>;

			jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockEmptyUsers);

			const result = await resolver.getUsers();
			expect(result).toEqual([]);
		});
	});

});

