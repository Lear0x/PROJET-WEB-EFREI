import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from '../src/conversation/conversation.resolver';
import { ConversationService } from '../src/conversation/conversation.service';
import { MessageService } from '../src/message/message.service';
import { Conversation } from '../src/conversation/conversation.model';
import { NotFoundException } from '@nestjs/common';


const mockConversation = (
  id: string = '1',
  title: string = 'Test Conversation',
  users: string[] = [],
  messages: string[] = []
): Conversation => ({
  _id: id,
  title,
  users,
  messages,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockConversationService = {
  create: jest.fn().mockResolvedValue(mockConversation()),
  findAll: jest.fn().mockResolvedValue([mockConversation()]),
  findOneById: jest.fn().mockResolvedValue(mockConversation()),
  findByUserId: jest.fn().mockResolvedValue([mockConversation()]),
  addMessage: jest.fn().mockResolvedValue(mockConversation()),
};

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
        {
          provide: MessageService,
          useValue: {}, // Mock MessageService if needed
        },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const input: CreateConversationInput = { title: 'Test Conversation', userIds: ['1', '2'] };
      const result = await resolver.createConversation(input);
      expect(result).toEqual(mockConversation());
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('conversations', () => {
    it('should return all conversations', async () => {
      const result = await resolver.conversations();
      expect(result).toEqual([mockConversation()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('conversation', () => {
    it('should return a conversation by id', async () => {
      const result = await resolver.conversation('1');
      expect(result).toEqual(mockConversation());
      expect(service.findOneById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if conversation not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(null);
      await expect(resolver.conversation('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('conversationsByUser', () => {
    it('should return conversations by user id', async () => {
      const result = await resolver.conversationsByUser('1');
      expect(result).toEqual([mockConversation()]);
      expect(service.findByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('addMessage', () => {
    it('should add a message to a conversation', async () => {
      const input: AddMessageInput = { conversationId: '1', messageId: 'msg1' };
      const result = await resolver.addMessage(input);
      expect(result).toEqual(mockConversation());
      expect(service.addMessage).toHaveBeenCalledWith('1', 'msg1');
    });
  });
});
