// src/conversation/conversation.schema.ts
import { Schema, Document } from 'mongoose';

export const ConversationSchema = new Schema({
  title: [String],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  timestamp: Date,
});

ConversationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export interface Conversation extends Document {
  id: string,
  title: string[];
  messages: string[];
  users: string[];
  timestamp: Date;
}
