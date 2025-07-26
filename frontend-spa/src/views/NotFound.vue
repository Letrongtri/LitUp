<template>
  <div class="error-page">
    <h1>404</h1>
    <p>The page you requested was not found.</p>
    <router-link to="/" class="btn btn-primary">Back to home page</router-link>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h1 {
  font-size: 8rem;
  color: #dc3545;
}

p {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.btn {
  font-size: 1.5rem;
  padding: 1rem 2rem;
}
</style>
