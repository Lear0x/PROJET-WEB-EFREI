import { Schema, Document } from 'mongoose';

export const ConversationSchema = new Schema({
  title: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  timestamp: { type: Schema.Types.Number, default: Date.now },
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
  title: string;
  messages: string[];
  userIds: string[];
  timestamp: number;
}