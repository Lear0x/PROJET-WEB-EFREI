import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from 'src/message/message.resolver';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.model';
import { NotFoundException } from '@nestjs/common';

const mockMessage = (
  id: string = '1',
  content: string = 'Test message',
  conversation: string = '1',
  from: string = '1'
): Message => ({
  _id: id,
  content,
  conversation,
  from,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockMessageService = {
  create: jest.fn().mockResolvedValue(mockMessage()),
  findAll: jest.fn().mockResolvedValue([mockMessage()]),
  findOneById: jest.fn().mockResolvedValue(mockMessage()),
  findByConversationId: jest.fn().mockResolvedValue([mockMessage()]),
  findByUserId: jest.fn().mockResolvedValue([mockMessage()]),
  update: jest.fn().mockResolvedValue(mockMessage()),
};

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const input: CreateMessageInput = { content: 'Test message', conversation: '1', from: '1' };
      const result = await resolver.createMessage(input);
      expect(result).toEqual(mockMessage());
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('messages', () => {
    it('should return all messages', async () => {
      const result = await resolver.messages();
      expect(result).toEqual([mockMessage()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('message', () => {
    it('should return a message by id', async () => {
      const result = await resolver.message('1');
      expect(result).toEqual(mockMessage());
      expect(service.findOneById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if message not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(null);
      await expect(resolver.message('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('messagesByConversation', () => {
    it('should return messages by conversation id', async () => {
      const result = await resolver.messagesByConversation('1');
      expect(result).toEqual([mockMessage()]);
      expect(service.findByConversationId).toHaveBeenCalledWith('1');
    });
  });

  describe('messagesByUser', () => {
    it('should return messages by user id', async () => {
      const result = await resolver.messagesByUser('1');
      expect(result).toEqual([mockMessage()]);
      expect(service.findByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      const input: UpdateMessageInput = { content: 'Updated message' };
      const result = await resolver.updateMessage('1', input);
      expect(result).toEqual(mockMessage());
      expect(service.update).toHaveBeenCalledWith('1', input);
    });
  });
});
