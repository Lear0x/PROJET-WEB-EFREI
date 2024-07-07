// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/home/Home.vue'; // Importez votre composant Home
import About from '@/views/about/About.vue'; // Importez votre composant About

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home // Associez la route '/' avec le composant Home
  },
  {
    path: '/about',
    name: 'About',
    component: About // Associez la route '/about' avec le composant About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
