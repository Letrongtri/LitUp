<!-- src/components/LoginForm.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/litup_service';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

async function handleLogin() {
  errorMsg.value = '';
  try {
    const result = await api.login({
      u_email: email.value,
      u_password: password.value,
    });
    localStorage.setItem('user', JSON.stringify(result));
    router.push('/');
  } catch (err) {
    errorMsg.value = err.message || 'Đăng nhập thất bại!';
  }
}
</script>

<template>
  <div>
    <h4 class="mb-3">Đăng nhập</h4>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
    <input v-model="password" type="password" class="form-control mb-3" placeholder="Mật khẩu" />
    <button class="btn btn-primary w-100" @click="handleLogin">Đăng nhập</button>
  </div>
</template>
