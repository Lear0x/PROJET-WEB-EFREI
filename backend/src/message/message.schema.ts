import { Schema, Document } from 'mongoose';

export const MessageSchema = new Schema({
  content: { type: String, required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  timeStamp: { type: Date, default: Date.now },
});

MessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export interface Message extends Document {
  id: string,
  content: string;
  from: string;
  conversation: string;
  timeStamp: Date;
}