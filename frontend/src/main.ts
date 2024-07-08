import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Assuming you have a Vuex store configured

console.log('FRONTEND - main - Starting');

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');
