<!-- src/components/RegisterForm.vue -->
<script setup>
import { ref } from 'vue';
import { api } from '@/services/litup_service';

const fullname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const successMsg = ref('');
const errorMsg = ref('');

async function handleRegister() {
  errorMsg.value = '';
  successMsg.value = '';

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Mật khẩu xác nhận không khớp!';
    return;
  }

  try {
    await api.register({
      u_fullname: fullname.value,
      u_email: email.value,
      u_password: password.value,
    });

    successMsg.value = 'Đăng ký thành công! Bạn có thể đăng nhập.';
  } catch (err) {
    errorMsg.value = err.message || 'Đăng ký thất bại!';
  }
}
</script>

<template>
  <div>
    <h4 class="mb-3">Đăng ký</h4>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <input v-model="fullname" type="text" class="form-control mb-2" placeholder="Họ tên" />
    <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
    <input v-model="password" type="password" class="form-control mb-2" placeholder="Mật khẩu" />
    <input v-model="confirmPassword" type="password" class="form-control mb-3" placeholder="Nhập lại mật khẩu" />

    <button class="btn btn-success w-100" @click="handleRegister">Đăng ký</button>
  </div>
</template>
