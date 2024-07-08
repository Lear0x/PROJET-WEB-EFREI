// src/store/types.ts

export interface Message {
  id: string;
  text: string;
  conversationId: string;
}
  
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
  
export interface State {
  conversations: Conversation[];
  currentConversation: Conversation | null;
}
  
export interface CreateConversationInput { 
  title: string; 
  userIds: string[]; 
}

export interface SendMessageInput { 
  text: string; 
  from: string; 
  conversationId: string; 
}
