import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { timestamp } from "rxjs";

@Injectable()
export class UserService {

    private readonly users = [
        { id: "1", username: 'John', password: 'test', email: 'toto', timeStamp: Date.now(), conversation : [] },
        { id: "2", username: 'eric', password: 'test2', email: 'toto2', timeStamp: Date.now(), conversation : []  },
      ];
    
      async create(data: User): Promise<User> {
            return {} as any;
      }
    
      async findOneById(id: string): Promise<User> {
            return this.users.find(user => user.id === id) as User;
      }
    
      async findAll(): Promise<User[]> {
            return this.users as User[];
      }
    
      async remove(id: string): Promise<boolean> {
            return true;
      }

    //   async signIn(username: string, password:string): Promise<User> {
    //         return {} as User;
    //   }
}