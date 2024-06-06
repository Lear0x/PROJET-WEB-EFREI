import { Message as GraphQLMessage } from '../message/message.model';
import { Message as MongooseMessage } from '../message/message.schema';
import { Conversation as GraphQLConversation } from '../conversation/conversation.model';
import { Conversation as MongooseConversation } from '../conversation/conversation.schema';

export function toGraphQLMessage(message: MongooseMessage): GraphQLMessage {
  return {
    id: message.id,
    content: message.content,
    from: message.from as any,
    conversationId: message.conversationId as any,
    timeStamp: message.timeStamp,
  };
}

export function toGraphQLConversation(conversation: MongooseConversation): GraphQLConversation {
  return {
    id: conversation.id,
    title: conversation.title,
    messageIds: conversation.messagesIds as any,
    userIds: conversation.userIds as any,
    timestamp: conversation.timestamp,
  };
}
