import { Message as GraphQLMessage } from '../message/message.model';
import { Message as MongooseMessage } from '../message/message.schema';
import { Conversation as GraphQLConversation } from '../conversation/conversation.model';
import { Conversation as MongooseConversation } from '../conversation/conversation.schema';

export function toGraphQLMessage(message: MongooseMessage): GraphQLMessage {
  return {
    id: message.id,
    content: message.content,
    from: message.from as any,  // you may need to populate the user and conversation if they are not populated
    conversationId: message.conversation as any,
    timeStamp: message.timeStamp,
  };
}

export function toGraphQLConversation(conversation: MongooseConversation): GraphQLConversation {
  return {
    id: conversation.id,
    title: conversation.title,
    messageIds: conversation.messages as any, // you may need to populate the messages if they are not populated
    users: conversation.users as any,       // you may need to populate the users if they are not populated
    timestamp: conversation.timestamp.getTime(),
  };
}
