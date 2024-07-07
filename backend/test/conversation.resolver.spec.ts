import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from '../src/conversation/conversation.resolver';
import { ConversationService } from '../src/conversation/conversation.service';
import { MessageService } from '../src/message/message.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConversationInput } from '../src/conversation/conversation.dto';
import { Conversation as SchemaConversation } from '../src/conversation/conversation.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ConversationResolver', () => {
    let resolver: ConversationResolver;
    let conversationService: ConversationService;

    const mockConversationModel = {
        new: jest.fn().mockResolvedValue(true),
        constructor: jest.fn().mockResolvedValue(true),
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        deleteOne: jest.fn(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConversationResolver,
                {
                    provide: ConversationService,
                    useValue: {
                        findAll: jest.fn(),
                        findOneById: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                        findByUserId: jest.fn(),
                        findByTitle: jest.fn(),
                    },
                },
                {
                    provide: MessageService,
                    useValue: {
                        findAll: jest.fn(),
                        findOneById: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: getModelToken('Conversation'),
                    useValue: mockConversationModel,
                },
            ],
        }).compile();

        resolver = module.get<ConversationResolver>(ConversationResolver);
        conversationService = module.get<ConversationService>(ConversationService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('conversation', () => {
        it('should throw BadRequestException for an invalid ID', async () => {
            const invalidId = '123';

            await expect(resolver.conversation(invalidId)).rejects.toThrow(BadRequestException);
            await expect(resolver.conversation(invalidId)).rejects.toThrow(`Invalid ID format: ${invalidId}`);
        });

        it('should throw NotFoundException if conversation not found', async () => {
            const validId = new Types.ObjectId().toString();
            jest.spyOn(conversationService, 'findOneById').mockResolvedValueOnce(null);

            await expect(resolver.conversation(validId)).rejects.toThrow(NotFoundException);
            await expect(resolver.conversation(validId)).rejects.toThrow();
        });

        it('should return a conversation if found', async () => {
            const validId = new Types.ObjectId().toString();
            const mockConversation = {
                id: validId,
                title: 'Test Conversation',
                messageIds: [],
                userIds: [],
                timestamp: Date.now(),
            };

            jest.spyOn(conversationService, 'findOneById').mockResolvedValueOnce(mockConversation);

            const result = await resolver.conversation(validId);
            expect(result).toEqual(mockConversation);
        });
    });

    describe('createConversation', () => {
        it('should create a conversation', async () => {
            const mockConversationData: ConversationInput = {
                title: 'New Conversation',
                userIds: ['user1', 'user2'],
            };

            jest.spyOn(conversationService, 'create').mockResolvedValueOnce(true);

            const result = await resolver.createConversation(mockConversationData);
            expect(result).toEqual(true);
        });
    });

    describe('removeConversation', () => {
        it('should remove a conversation if found', async () => {
            const validId = new Types.ObjectId().toString();

            jest.spyOn(conversationService, 'remove').mockResolvedValueOnce(true);

            const result = await resolver.removeConversation(validId);
            expect(result).toEqual(true);
        });

        it('should throw NotFoundException if conversation not found', async () => {
            const validId = new Types.ObjectId().toString();

            jest.spyOn(conversationService, 'remove').mockResolvedValueOnce(false);

            await expect(resolver.removeConversation(validId)).rejects.toThrow(NotFoundException);
            await expect(resolver.removeConversation(validId)).rejects.toThrow("Not Found");
        });
    });

    describe('conversations', () => {
        it('should return an array of conversations', async () => {
            const mockConversations: any[] = [
                {
                    _id: new Types.ObjectId().toString(),
                    title: 'Conversation 1',
                    messageIds: [],
                    userIds: [],
                    timestamp: Date.now(),
                },
                {
                    _id: new Types.ObjectId().toString(),
                    title: 'Conversation 2',
                    messageIds: [],
                    userIds: [],
                    timestamp: Date.now(),
                },
            ];

            jest.spyOn(conversationService, 'findAll').mockResolvedValueOnce(mockConversations);

            const result = await resolver.conversations();
            expect(result).toEqual(mockConversations);
        });

        it('should return an empty array if no conversations found', async () => {
            const mockEmptyConversations = [] as SchemaConversation[];

            jest.spyOn(conversationService, 'findAll').mockResolvedValueOnce(mockEmptyConversations);

            const result = await resolver.conversations();
            expect(result).toEqual([]);
        });
    });

    describe('conversationByUserId', () => {
        it('should return conversations for a specific user', async () => {
            const userId = new Types.ObjectId().toString();

            const mockConversations: any[] = [
                {
                    _id: new Types.ObjectId().toString(),
                    title: 'Conversation 1',
                    messageIds: [],
                    userIds: [userId],
                    timestamp: Date.now(),
                },
                {
                    _id: new Types.ObjectId().toString(),
                    title: 'Conversation 2',
                    messageIds: [],
                    userIds: [],
                    timestamp: Date.now(),
                },
            ];

            jest.spyOn(conversationService, 'findByUserId').mockResolvedValueOnce(mockConversations);

            const result = await resolver.conversationByUserId(userId);
            expect(result).toEqual([mockConversations[0]]);
        });
    });

    describe('conversationByTitle', () => {
        it('should return conversations with a specific title', async () => {
            const title = 'Conversation 1';

            const mockConversations: any[] = [
                {
                    _id: new Types.ObjectId().toString(),
                    title: title,
                    messageIds: [],
                    userIds: [],
                    timestamp: Date.now(),
                },
                {
                    _id: new Types.ObjectId().toString(),
                    title: 'Conversation 2',
                    messageIds: [],
                    userIds: [],
                    timestamp: Date.now(),
                },
            ];

            jest.spyOn(conversationService, 'findByTitle').mockResolvedValueOnce(mockConversations);

            const result = await resolver.conversationByTitle(title);
            expect(result).toEqual([mockConversations[0]]);
        });
    });
});
