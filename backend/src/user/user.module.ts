import { Module } from '@nestjs/common';
import { DateScalar } from '../common/date.scalar';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService, UserResolver, DateScalar],
  exports: [UserService],
})
export class UserModule {}