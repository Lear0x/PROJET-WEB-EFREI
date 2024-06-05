import { Test, TestingModule } from '@nestjs/testing';

import { ConversationService } from 'src/conversation/conversation.service';
import { ConversationResolver } from 'src/conversation/conversation.resolver';
import { Conversation } from 'src/conversation/conversation.model';
import { ConversationInput } from 'src/conversation/conversation.dto';
import { User } from 'src/user/user.model';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let conversationService: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationResolver, ConversationService],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
    conversationService = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('conversation', () => {
    it('should return a conversation by id', async () => {
      const mockConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        messages: [],
        users: [],
        timestamp: Date.now(),
      };

      jest.spyOn(conversationService, 'findOneById').mockResolvedValueOnce(mockConversation);

      const result = await resolver.conversation('1');
      expect(result).toEqual(mockConversation);
    });
  });

  describe('getConversations', () => {
    it('should return an array of conversations', async () => {
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'Test Conversation 1',
          messages: [],
          users: [],
          timestamp: Date.now(),
        },
        {
          id: '2',
          title: 'Test Conversation 2',
          messages: [],
          users: [],
          timestamp: Date.now(),
        },
      ];

      jest.spyOn(conversationService, 'findAll').mockResolvedValueOnce(mockConversations);

      const result = await resolver.conversations();
      expect(result).toEqual(mockConversations);
    });
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const mockUser1: User = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        timeStamp: Date.now(),
      };
      const mockUser2: User = {
        id: '2',
        username: 'user2',
        email: 'user2@example.com',
        password: 'password',
        timeStamp: Date.now(),
      };

      const conversationInput: ConversationInput = {
        title: 'Test Conversation',
        userIds: ['1', '2'],
      };

      const mockConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        messages: [],
        users: [],
        timestamp: Date.now(),
      };
      
      jest.spyOn(conversationService, 'create').mockResolvedValueOnce(mockConversation);

      const result = await resolver.createConversation(conversationInput);
      expect(result).toBe(true);
    });
  });

  describe('removeConversation', () => {
    it('should remove a conversation by id', async () => {
      jest.spyOn(conversationService, 'remove').mockResolvedValueOnce(true);

      const result = await resolver.removeConversation('1');
      expect(result).toBe(true);
    });
  });
});
