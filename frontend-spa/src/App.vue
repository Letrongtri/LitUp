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
