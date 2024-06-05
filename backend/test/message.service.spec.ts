import { Test, TestingModule } from '@nestjs/testing';

import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.model';
import { MessageInput } from 'src/message/message.dto';
import { Conversation } from 'src/conversation/conversation.model';
import { User } from '../src/user/user.model';
import { MessageResolver } from '../src/message/message.resolver';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageResolver, MessageService],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('message', () => {
    it('should return a message by id', async () => {
      const mockMessage: Message = {
        id: '1',
        content: 'Test Message',
        userId: '1',
        conversation: { id: '1' } as Conversation,
        timeStamp: new Date(),
      };

      jest.spyOn(messageService, 'findOneById').mockResolvedValueOnce(mockMessage);

      const result = await resolver.message('1');
      expect(result).toEqual(mockMessage);
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const mockUser: User = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        timeStamp: Date.now(),
      };

      const mockConversation: Conversation = {
        id: '1',
        title: 'Test Conversation',
        messages: [],
        users: [],
        timestamp: Date.now(),
      };

      const messageInput: MessageInput = {
        content: 'Test Message',
        userId: '1',
        conversation: mockConversation,
      };

      const mockMessage: Message = {
        id: '1',
        content: 'Test Message',
        userId: '1',
        conversation: { id: '1' } as Conversation,
        timeStamp: new Date(),
      };
      
      jest.spyOn(messageService, 'create').mockResolvedValueOnce(mockMessage);

      const result = await resolver.createMessage(messageInput);
      expect(result).toBe(true);
    });
  });

  describe('removeMessage', () => {
    it('should remove a message by id', async () => {
      jest.spyOn(messageService, 'remove').mockResolvedValueOnce(true);

      const result = await resolver.removeMessage('1');
      expect(result).toBe(true);
    });
  });
});
