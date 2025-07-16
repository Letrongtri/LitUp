<template>
  <AppHeader />
  <main class="p-4">
    <router-view />
  </main>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style>
body {
  margin: 0;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
}
</style>
