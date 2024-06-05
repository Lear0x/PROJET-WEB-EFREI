import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { UserResolver } from 'src/user/user.resolvers';
import { User } from '../src/user/user.model';
import { UserInput } from '../src/user/user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('user', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        timeStamp: Date.now(),
      };

      jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(mockUser);

      const result = await resolver.user('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
        jest.spyOn(userService, 'findOneById').mockResolvedValueOnce(null as unknown as User);
      
        await expect(resolver.user('1')).rejects.toThrowError(NotFoundException);
      });
  });

  describe('getUsers', () => {
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

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(mockUsers);

      const result = await resolver.getUsers();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userInput: UserInput = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpassword',
      };

      jest.spyOn(userService, 'create').mockResolvedValueOnce(true);

      const result = await resolver.createUser(userInput);
      expect(result).toBe(true);
    });
  });

  describe('removeUser', () => {
    it('should remove a user by id', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValueOnce(true);

      const result = await resolver.removeUser('1');
      expect(result).toBe(true);
    });
  });
});
