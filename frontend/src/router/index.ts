import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ConversationPage from '@/views/ConversationPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/conversation/:id',
    name: 'Conversation',
    component: ConversationPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
