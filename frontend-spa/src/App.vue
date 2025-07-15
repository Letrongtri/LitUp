<template>
  <AppHeader />
  <main class="p-4">
    <router-view />
  </main>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

userStore.initFromLocalStorage();
</script>

<style>
body {
  margin: 0;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}
</style>
