import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolvers';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}