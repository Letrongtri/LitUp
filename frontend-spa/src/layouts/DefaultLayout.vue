<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
  <div>
    <AppHeader />
    <main class="py-4 px-0 w-100">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
