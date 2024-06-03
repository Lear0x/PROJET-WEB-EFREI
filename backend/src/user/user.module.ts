import { Module } from '@nestjs/common';
import { DateScalar } from '../common/date.scalar';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService, DateScalar],
})
export class UserModule {}