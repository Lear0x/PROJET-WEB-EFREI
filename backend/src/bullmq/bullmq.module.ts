import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullMQService } from './bullmq.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisHost = 'redis';
        const redisPort = 6379;
        console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
        return {
          connection: {
            host: redisHost,
            port: redisPort,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    }),
  ],
  providers: [BullMQService],
  exports: [BullMQService],
})
export class BullMQModule {}
