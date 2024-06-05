import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserInput } from './user.dto';
@Injectable()
export class UserService {
      constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

      async findOneById(id: string): Promise<User|null|undefined> {
            return await this.userModel.findById(id).exec();
      }
      
      async findAll(): Promise<User[]> {
            return await this.userModel.find().exec();
      }
      
      async create(data: UserInput): Promise<boolean> {
            const newUser = new this.userModel(data);
            await newUser.save();
            return true;
      }
      
      async remove(id: string): Promise<User|null|undefined> {
            return await this.userModel.findByIdAndDelete(id).exec();
      }

      async signIn(username: string, password:string): Promise<Boolean|User> {
               return false;
      }
}