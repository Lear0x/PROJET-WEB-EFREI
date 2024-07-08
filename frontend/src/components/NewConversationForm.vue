<template>
  <form @submit.prevent="createConversation">
    <input v-model="title" placeholder="Nom" />
    <button type="submit">Ajouter</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'NewConversationForm',
  setup(props, { emit }) {
    const store = useStore();
    const title = ref('');

    async function createConversation() {
      await store.dispatch('createConversation', { title: title.value });
      title.value = '';
      emit('created');
    }

    return { title, createConversation };
  },
});
</script>
