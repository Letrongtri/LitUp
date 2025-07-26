import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);
const pinia = createPinia();
const queryClient = new QueryClient();

app.use(pinia).use(router).use(VueQueryPlugin, { queryClient }).mount('#app');
