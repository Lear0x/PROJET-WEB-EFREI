<template>
  <form @submit.prevent="sendMessage">
    <input v-model="text" placeholder="Nouveau message" />
    <button type="submit">Envoyer</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'NewMessageForm',
  setup(props, { emit }) {
    const store = useStore();
    const text = ref('');

    async function sendMessage() {
      await store.dispatch('sendMessage', { text: text.value, conversationId: store.state.currentConversation.id });
      text.value = '';
      emit('sent');
    }

    return { text, sendMessage };
  },
});
</script>
