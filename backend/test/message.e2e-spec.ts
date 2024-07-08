import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';

describe('MessageResolver (e2e)', () => {
  let app: INestApplication;
  let createdMessageId: string;
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

  it('should create users for message tests', async () => {
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

  it('should create a new conversation for message tests', async () => {
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

  it('should send a new message', async () => {
    const mutation = `
      mutation {
        sendMessage(data: { content: "Hello, world!", from: "${userId1}", conversationId: "${createdConversationId}" })
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.sendMessage).toBe(true);

    const query = `
      query {
        messagesByConversationId(conversationId: "${createdConversationId}") {
          id
          content
          from
        }
      }
    `;

    const msgResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { messagesByConversationId } = msgResponse.body.data;
    const newMessage = messagesByConversationId.find((msg: { content: string; }) => msg.content === 'Hello, world!');
    expect(newMessage).toBeDefined();
    createdMessageId = newMessage.id;
  });

  it('should fetch all messages', async () => {
    const query = `
      query {
        messages {
          id
          content
          from
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { messages } = response.body.data;
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThanOrEqual(1);
  });

  it('should fetch a message by ID', async () => {
    const query = `
      query {
        message(id: "${createdMessageId}") {
          id
          content
          from
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { message } = response.body.data;
    expect(message).toBeDefined();
    expect(message.id).toBe(createdMessageId);
    expect(message.content).toBe('Hello, world!');
  });

  it('should fetch messages by conversation ID', async () => {
    const query = `
      query {
        messagesByConversationId(conversationId: "${createdConversationId}") {
          id
          content
          from
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { messagesByConversationId } = response.body.data;
    expect(messagesByConversationId).toBeDefined();
    expect(messagesByConversationId.length).toBeGreaterThanOrEqual(1);
    expect(messagesByConversationId[0].conversationId).toBe(createdConversationId);
  });

  it('should fetch messages by user ID', async () => {
    const query = `
      query {
        messagesByUserId(userId: "${userId1}") {
          id
          content
          from
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { messagesByUserId } = response.body.data;
    expect(messagesByUserId).toBeDefined();
    expect(messagesByUserId.length).toBeGreaterThanOrEqual(1);
    expect(messagesByUserId[0].from).toBe(userId1);
  });

  it('should remove a message', async () => {
    const mutation = `
      mutation {
        removeMessage(id: "${createdMessageId}")
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.removeMessage).toBe(true);

    const query = `
      query {
        message(id: "${createdMessageId}") {
          id
          content
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200, {
        data: {
          message: null
        }
      });
  });
});
