import { MongooseModule } from '@nestjs/mongoose';

export const MongoDBConfig = MongooseModule.forRoot('mongodb://localhost/nest', {
});