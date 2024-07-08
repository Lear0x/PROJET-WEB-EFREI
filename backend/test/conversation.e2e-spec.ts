import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';

describe('ConversationResolver (e2e)', () => {
  let app: INestApplication;
  let createdConversationId: string;
  let userId1: string;
  let userId2: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create users for conversation tests', async () => {
    const mutation1 = `
      mutation {
        createUser(data: { username: "user1", email: "user1@example.com", password: "password" })
      }
    `;
    const mutation2 = `
      mutation {
        createUser(data: { username: "user2", email: "user2@example.com", password: "password" })
      }
    `;

    await request(app.getHttpServer()).post('/graphql').send({ query: mutation1 }).expect(200);
    await request(app.getHttpServer()).post('/graphql').send({ query: mutation2 }).expect(200);

    const query = `
      query {
        users {
          id
          username
        }
      }
    `;

    const response = await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200);
    const { users } = response.body.data;
    userId1 = users.find((user: { username: string; }) => user.username === 'user1').id;
    userId2 = users.find((user: { username: string; }) => user.username === 'user2').id;
  });

  it('should create a new conversation', async () => {
    const mutation = `
      mutation {
        createConversation(data: { title: "Test Conversation", userIds: ["${userId1}", "${userId2}"] })
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createConversation).toBe(true);

    const query = `
      query {
        conversations {
          id
          title
          userIds
        }
      }
    `;

    const convResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { conversations } = convResponse.body.data;
    const newConversation = conversations.find((conv: { title: string; }) => conv.title === 'Test Conversation');
    expect(newConversation).toBeDefined();
    createdConversationId = newConversation.id;
  });

  it('should fetch all conversations', async () => {
    const query = `
      query {
        conversations {
          id
          title
          userIds
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { conversations } = response.body.data;
    expect(conversations).toBeDefined();
    expect(conversations.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a conversation by ID', async () => {
    const query = `
      query {
        conversation(id: "${createdConversationId}") {
          id
          title
          userIds
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { conversation } = response.body.data;
    expect(conversation).toBeDefined();
    expect(conversation.id).toBe(createdConversationId);
    expect(conversation.title).toBe('Test Conversation');
  });

  it('should fetch conversations by user ID', async () => {
    const query = `
      query {
        conversationByUserId(userId: "${userId1}") {
          id
          title
          userIds
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { conversationByUserId } = response.body.data;
    expect(conversationByUserId).toBeDefined();
    expect(conversationByUserId.length).toBeGreaterThanOrEqual(1);
    expect(conversationByUserId[0].userIds).toContain(userId1);
  });

  it('should fetch conversations by title', async () => {
    const query = `
      query {
        conversationByTitle(title: "Test Conversation") {
          id
          title
          userIds
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { conversationByTitle } = response.body.data;
    expect(conversationByTitle).toBeDefined();
    expect(conversationByTitle.length).toBeGreaterThanOrEqual(1);
    expect(conversationByTitle[0].title).toBe('Test Conversation');
  });

  it('should remove a conversation', async () => {
    const mutation = `
      mutation {
        removeConversation(id: "${createdConversationId}")
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.removeConversation).toBe(true);

    const query = `
      query {
        conversation(id: "${createdConversationId}") {
          id
          title
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200, {
        data: {
          conversation: null
        }
      });
  });
});
