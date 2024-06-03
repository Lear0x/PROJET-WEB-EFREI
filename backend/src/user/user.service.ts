import { Injectable } from "@nestjs/common";
import { User } from "./user.model";

@Injectable()
export class UserService {

    private readonly users = [
        { id: 1, username: 'John', password: 'test' },
        { id: 2, name: 'Doe' },
      ];
    
      async create(data: User): Promise<User> {
            return {} as any;
      }
    
      async findOneById(id: string): Promise<User> {
            return {} as any;
      }
    
      async findAll(): Promise<User[]> {
            return [] as User[];
      }
    
      async remove(id: string): Promise<boolean> {
            return true;
      }

    //   async signIn(username: string, password:string): Promise<User> {
    //         return {} as User;
    //   }
}