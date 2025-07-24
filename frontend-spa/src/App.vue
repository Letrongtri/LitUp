<!-- <template>
  <div v-if="user">
    <AppHeader />
    <div class="d-flex">
      <div class="mw-280 position-sticky">
        <AppSidebar />
      </div>
      <main class="py-4 px-0 w-100">
        <router-view />
      </main>
    </div>
    <AppFooter />
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';

const user = localStorage.getItem('user');
</script> -->

<!-- <script setup>
import { shallowRef, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const layoutComponent = shallowRef(null);

watchEffect(async () => {
  console.log('Route changed to:', route.path);
  const layout = route.meta.layout || 'default';

  switch (layout) {
    case 'auth':
      layoutComponent.value = (await import('@/layouts/AuthLayout.vue')).default;
      break;
    case 'default':
      layoutComponent.value = (await import('@/layouts/DefaultLayout.vue')).default;
      break;
    default:
      layoutComponent.value = (await import('@/layouts/DefaultLayout.vue')).default;
      break;
  }
});
</script> -->

<template>
  <component :is="$route.meta.layout">
    <router-view />
  </component>
</template>

<style>
body {
  margin: 0;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}
</style>
