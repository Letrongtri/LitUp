<template>
  <div class="error-page">
    <h1>403</h1>
    <p>Bạn không có quyền truy cập trang này.</p>
    <router-link to="/" class="btn btn-primary">Về trang chủ</router-link>
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
  font-size: 5rem;
  color: #ffc107;
}
p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}
</style>
