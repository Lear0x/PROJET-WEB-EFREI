// src/services/graphqlService.ts

import { GraphQLClient, gql } from 'graphql-request';
import { Conversation, Message, CreateConversationInput, SendMessageInput } from '@/store/types';

const endpoint = 'http://localhost:3000/graphql';
const client = new GraphQLClient(endpoint, {
  headers: {

  },
});

export async function getConversations(): Promise<Conversation[]> {
  console.log('SERVICE - graphqlService - getConversations');
  const query = gql`
    query GetConversations {
      conversations {
        id
        title
        userIds
      }
    }
  `;

  try {
    const data = await client.request(query);
    return data.conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

export async function createConversation(conversationData: CreateConversationInput): Promise<string> {
  console.log('SERVICE - graphqlService - createConversation');
  const mutation = gql`
    mutation CreateConversation($conversationData: ConversationInput!) {
      createConversation(data: $conversationData)
    }
  `;

  try {
    const data = await client.request(mutation, { conversationData });
    return data.createConversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  console.log('SERVICE - graphqlService - getMessages');
    const query = gql`
      query GetMessages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          id
          text
          conversationId
        }
      }
    `;
  
    try {
      const data = await client.request(query, { conversationId });
      return data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
  
  export async function sendMessage(messageData: SendMessageInput): Promise<string> {
    console.log('SERVICE - graphqlService - sendMessage');
    const mutation = gql`
      mutation SendMessage($data: MessageInput!) {
        sendMessage(data: $data)
      }
    `;
  
    try {
      const data = await client.request(mutation, { data: messageData });
      return data.sendMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  