import { Schema, Document } from 'mongoose';
import { Conversation } from 'src/conversation/conversation.model';

export const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  timeStamp: { type: Schema.Types.Number, default: Date.now },
  conversationsIds: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  timeStamp: number;
  conversations?: Conversation[] | null;
  conversationsIds? : string[] | null;
}