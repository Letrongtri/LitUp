<template>
  <div class="error-page">
    <h1>404</h1>
    <p>Không tìm thấy trang bạn yêu cầu.</p>
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
  color: #dc3545;
}
p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}
</style>
