import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from '../src/message/message.resolver';
import { MessageService } from '../src/message/message.service';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { MessageInput } from '../src/message/message.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message as SchemaMessage } from '../src/message/message.schema';

describe('MessageResolver', () => {
    let resolver: MessageResolver;
    let messageService: MessageService;
    let messageModel: Model<SchemaMessage>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageResolver,
                {
                    provide: MessageService,
                    useValue: {
                        findAll: jest.fn(),
                        findOneById: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                        findByConversationId: jest.fn(),
                    },
                },
                {
                    provide: getModelToken('Message'),
                    useValue: {
                        new: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<MessageResolver>(MessageResolver);
        messageService = module.get<MessageService>(MessageService);
        messageModel = module.get<Model<SchemaMessage>>(getModelToken('Message'));
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('message', () => {
        it('should throw NotFoundException if message not found', async () => {
            const validId = new Types.ObjectId().toString();
            jest.spyOn(messageService, 'findOneById').mockResolvedValueOnce(null);

            await expect(resolver.message(validId)).rejects.toThrow(NotFoundException);
            await expect(resolver.message(validId)).rejects.toThrow(validId);
        });

        it('should return a message if found', async () => {
            const validId = new Types.ObjectId().toString();
            const mockMessage = new messageModel({
                _id: validId,
                conversationId: new Types.ObjectId().toString(),
                senderId: new Types.ObjectId().toString(),
                content: 'Test message',
                timestamp: Date.now(),
            });

            jest.spyOn(messageService, 'findOneById').mockResolvedValueOnce(mockMessage);

            const result = await resolver.message(validId);
            expect(result).toEqual(mockMessage.toObject());
        });
    });

    describe('createMessage', () => {
        it('should create a message', async () => {
            const mockMessageData: MessageInput = {
                conversationId: new Types.ObjectId().toString(),
                senderId: new Types.ObjectId().toString(),
                content: 'New message',
            };

            jest.spyOn(messageService, 'create').mockResolvedValueOnce(true);

            const result = await resolver.createMessage(mockMessageData);
            expect(result).toEqual(true);
        });
    });

    describe('removeMessage', () => {
        it('should remove a message if found', async () => {
            const validId = new Types.ObjectId().toString();

            jest.spyOn(messageService, 'remove').mockResolvedValueOnce(true);

            const result = await resolver.removeMessage(validId);
            expect(result).toEqual(true);
        });

        it('should throw NotFoundException if message not found', async () => {
            const validId = new Types.ObjectId().toString();

            jest.spyOn(messageService, 'remove').mockResolvedValueOnce(false);

            await expect(resolver.removeMessage(validId)).rejects.toThrow(NotFoundException);
            await expect(resolver.removeMessage(validId)).rejects.toThrow("Not Found");
        });
    });

    describe('messages', () => {
        it('should return an array of messages', async () => {
            const mockMessages: any[] = [
                new messageModel({
                    _id: new Types.ObjectId().toString(),
                    conversationId: new Types.ObjectId().toString(),
                    senderId: new Types.ObjectId().toString(),
                    content: 'Message 1',
                    timestamp: Date.now(),
                }),
                new messageModel({
                    _id: new Types.ObjectId().toString(),
                    conversationId: new Types.ObjectId().toString(),
                    senderId: new Types.ObjectId().toString(),
                    content: 'Message 2',
                    timestamp: Date.now(),
                }),
            ];

            jest.spyOn(messageService, 'findAll').mockResolvedValueOnce(mockMessages);

            const result = await resolver.messages();
            expect(result).toEqual(mockMessages.map(msg => msg.toObject()));
        });

        it('should return an empty array if no messages found', async () => {
            const mockEmptyMessages = [] as SchemaMessage[];

            jest.spyOn(messageService, 'findAll').mockResolvedValueOnce(mockEmptyMessages);

            const result = await resolver.messages();
            expect(result).toEqual([]);
        });
    });

    describe('messagesByConversationId', () => {
        it('should return messages for a specific conversation', async () => {
            const conversationId = new Types.ObjectId().toString();
            const mockMessages: any[] = [
                new messageModel({
                    _id: new Types.ObjectId().toString(),
                    conversationId: conversationId,
                    senderId: new Types.ObjectId().toString(),
                    content: 'Message 1',
                    timestamp: Date.now(),
                }),
            ];

            jest.spyOn(messageService, 'findByConversationId').mockResolvedValueOnce(mockMessages);

            const result = await resolver.messagesByConversationId(conversationId);
            expect(result).toEqual(mockMessages.map(msg => msg.toObject()));
        });
    });
});
