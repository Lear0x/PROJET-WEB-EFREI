import { createStore, Store } from 'vuex';
import { State, Conversation, Message } from './types';
import * as graphqlService from '@/services/graphqlService';

export default createStore<State>({
  state: {
    conversations: [],
    currentConversation: null,
  },

  mutations: {
    setConversations(state, conversations: Conversation[]) {
      state.conversations = conversations;
    },
    setCurrentConversation(state, conversation: Conversation) {
      state.currentConversation = conversation;
    },
    addMessage(state, message: Message) {
      const conversation = state.conversations.find(conv => conv.id === message.conversationId);
      if (conversation) {
        conversation.messages.push(message);
      }
    },
  },
  
  actions: {
    async fetchConversations({ commit }) {
      const conversations = await graphqlService.getConversations();
      commit('setConversations', conversations);
    },
    async fetchMessages({ commit, state }, conversationId: string) {
      const result = await graphqlService.sendMessage({
        text: 'Nouveau message',
        from: 'utilisateur_id',
        conversationId: 'conversation_id',
      });
      commit('fetchMessages', result);
    },
    async sendMessage({ dispatch }, { text, conversationId }: { text: string, conversationId: string }) {
      await graphqlService.sendMessage({ text: text, from: 'utilisateur_id', conversationId });
      dispatch('fetchMessages', conversationId);
    },
    async createConversation({ dispatch }, { title }: { title: string }) {
      await graphqlService.createConversation({ title, userIds: ['utilisateur_id1', 'utilisateur_id2'] });
      dispatch('fetchConversations');
    },
  },
});
