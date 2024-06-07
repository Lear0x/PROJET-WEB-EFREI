import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolvers';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { MongoDBConfig } from './common/mongodb.config';
import { BullMQModule } from './bullmq/bullmq.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports:
        [
            GraphQLModule.forRoot<ApolloDriverConfig>({
                driver: ApolloDriver,
                autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
             }),
            MongoDBConfig,
            UserModule,
            MessageModule,
            ConversationModule,
            BullMQModule,
        ],
    controllers: [AppController, HealthController],
    providers: [AppService, AppResolver],
})
export class AppModule { }
