import { BullModule } from '@nestjs/bull';

export const BullConfigModule = BullModule.forRoot({
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
