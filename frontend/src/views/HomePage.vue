<template>
  <div>
    <h1>Home Page - Conversations</h1>
    <ul>
      <li v-for="conversation in conversations" :key="conversation.id">
        {{ conversation.title }}
      </li>
    </ul>
    <form @submit.prevent="createNewConversation">
      <input type="text" v-model="newConversationTitle" placeholder="New Conversation Title">
      <button type="submit">Create Conversation</button>
    </form>
  </div>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { getConversations, createConversation } from '@/services/graphqlService';
  import { Conversation } from '@/store/types';

  export default defineComponent({
    name: 'HomePage',
    setup() {
      const conversations = ref<Conversation[]>([]); 
      const newConversationTitle = ref('');

      const fetchConversations = async () => {
        try {
          conversations.value = await getConversations();
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };

      const createNewConversation = async () => {
        try {
          await createConversation({title: newConversationTitle.value, userIds:[]});
          await fetchConversations();
          newConversationTitle.value = '';
        } catch (error) {
          console.error('Error creating conversation:', error);
        }
      };

      fetchConversations();

      return {
        conversations,
        newConversationTitle,
        fetchConversations,
        createNewConversation,
      };
    },
  });
</script>
  