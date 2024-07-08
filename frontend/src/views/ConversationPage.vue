<template>
  <div>
    <button @click="goBack">Back to Conversations</button>
    <h1>Conversation: {{ conversationTitle }}</h1>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{ message.text }}
      </li>
    </ul>
    <form @submit.prevent="sendMessageHandler">
      <input type="text" v-model="newMessageText" placeholder="Type your message...">
      <button type="submit">Send Message</button>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getMessages, sendMessage } from '@/services/graphqlService';
  import { Message } from '@/store/types';

  export default defineComponent({
    name: 'ConversationPage',
    setup() {
      const route = useRoute();
      const router = useRouter();
      const conversationId = ref(route.params.id);
      const conversationTitle = ref('');
      const messages = ref<Message[]>([]);
      const newMessageText = ref('');

      const fetchMessages = async () => {
        try {
          const conversationMessages = await getMessages(
            Array.isArray(conversationId.value) ? conversationId.value[0] : conversationId.value
          );
          messages.value = conversationMessages;
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      const sendMessageHandler  = async () => {
        try {
          await sendMessage({
            text: newMessageText.value,
            from: 'currentUserId',
            conversationId: conversationId.value as string,
          });
          await fetchMessages();
          newMessageText.value = '';
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };

      const goBack = () => {
        router.push({ name: 'Home' });
      };

      fetchMessages();

      return {
        conversationTitle,
        messages,
        newMessageText,
        fetchMessages,
        sendMessageHandler ,
        goBack,
      };
    },
  });
</script>
