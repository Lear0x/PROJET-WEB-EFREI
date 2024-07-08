import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;

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

  let createdUserId: string;

  it('should fetch all users', async () => {
    const query = `
      query {
        users {
          id
          username
          email
          conversationIds
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { users } = response.body.data;
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it('should create a new user', async () => {
    const mutation = `
      mutation {
        createUser(data: { username: "newuser", email: "newuser@example.com", password: "password" })
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createUser).toBe(true);

    const query = `
      query {
        users {
          id
          username
          email
        }
      }
    `;

    const userResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { users } = userResponse.body.data;
    const newUser = users.find((user: { username: string; email: string; }) => user.username === 'newuser' && user.email === 'newuser@example.com');
    expect(newUser).toBeDefined();
    createdUserId = newUser.id;
  });

  it('should fetch a user by ID', async () => {
    const query = `
      query {
        user(id: "${createdUserId}") {
          id
          username
          email
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const { user } = response.body.data;
    expect(user).toBeDefined();
    expect(user.id).toBe(createdUserId);
    expect(user.username).toBe('newuser');
    expect(user.email).toBe('newuser@example.com');
  });

  it('should remove a user', async () => {
    const mutation = `
      mutation {
        removeUser(id: "${createdUserId}")
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.removeUser).toBe(true);

    const query = `
      query {
        user(id: "${createdUserId}") {
          id
          username
          email
        }
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200, {
        data: {
          user: null
        }
      });
  });
});
