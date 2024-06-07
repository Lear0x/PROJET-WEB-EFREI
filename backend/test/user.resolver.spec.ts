import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from 'src/user/user.resolvers';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserInput } from 'src/user/user.dto';

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
            findOneById: jest.fn(),
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
      const mockUser: User = {
        id: validId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
        timeStamp: Date.now(),
      };

      const result = await resolver.user(validId);
      expect(result).toEqual(mockUser);
    });
  });


  describe('users', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          password: 'password',
          timeStamp: Date.now(),
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          password: 'password',
          timeStamp: Date.now(),
        },
      ];

      const result = await resolver.getUsers();
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array if no users found', async () => {
      const result = await resolver.getUsers();
      expect(result).toEqual([]);
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
      };
      const mockUserData: UserInput = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password',
      };
  
      await expect(resolver.createUser(mockUserData)).rejects.toThrowError('User already exists');
    });
  
    it('should create a user if user does not exist', async () => {
      const mockUserData: UserInput = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
      };
  
      await resolver.createUser(mockUserData);
  
      expect(userService.create).toHaveBeenCalledWith(mockUserData);
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
      await expect(resolver.removeUser(validId)).rejects.toThrow(validId);
    });

    it('should remove a user if found', async () => {
      const validId = new Types.ObjectId().toString();

      await resolver.removeUser(validId);

      expect(userService.remove).toHaveBeenCalledWith(validId);
    });
  });


});
