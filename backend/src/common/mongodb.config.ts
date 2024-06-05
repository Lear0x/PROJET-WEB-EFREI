import { MongooseModule } from '@nestjs/mongoose';

export const MongoDBConfig = MongooseModule.forRoot('mongodb://admin:password@mongo:27017', {
    dbName: 'whatsapp-de-wish'
});