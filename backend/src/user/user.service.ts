import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { timestamp } from "rxjs";
import { UserInput } from "./user.dto";

@Injectable()
export class UserService {

      private users = [
            { id: "1", username: 'John', password: 'test', email: 'toto', timeStamp: Date.now() },
            { id: "2", username: 'eric', password: 'test2', email: 'toto2', timeStamp: Date.now() },
      ];

      async create(data: UserInput): Promise<boolean> {
            try {
                  const newUser: User = {
                        ...data,
                        timeStamp: Date.now()
                  };
                  this.users.push(newUser);
                  return true;
            } catch (error) {
                  return false;
            };
      }

      async findOneById(id: string): Promise<User> {
            return this.users.find(user => user.id === id) as User;
      }

      async findAll(): Promise<User[]> {
            return this.users as User[];
      }

      async remove(id: string): Promise<boolean> {
            const userIndex = this.users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                  return false;
            }
            this.users.splice(userIndex, 1);
            return true;
      }

      //   async signIn(username: string, password:string): Promise<User> {
      //         return {} as User;
      //   }
}