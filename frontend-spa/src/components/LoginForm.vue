<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';

const router = useRouter();

const loginForm = ref({
  u_email: '',
  u_password: '',
});

const emit = defineEmits(['change-mode', 'set-success', 'set-error']);

async function handleLogin() {
  try {
    const result = await authService.login(loginForm.value);

    localStorage.setItem('user', JSON.stringify(result.user));

    emit('set-error', '');
    emit('set-success', 'Log in successful!');
    router.push('/');
  } catch (err) {
    emit('set-error', err.message || 'Log in failed!');
  }
}

function changeToRegisterMode() {
  emit('change-mode', 'register');
}
</script>

<template>
  <div>
    <input v-model="loginForm.u_email" type="email" class="form-control mb-3" placeholder="Email" />
    <input
      v-model="loginForm.u_password"
      type="password"
      class="form-control mb-3"
      placeholder="Password"
    />
    <div class="d-flex justify-content-between align-items-center mb-3 text-muted small">
      <div><input type="checkbox" class="form-check-input me-1" /> Remember me</div>
    </div>

    <button class="btn btn-gradient w-100 mb-3" @click="handleLogin">Login</button>

    <p class="text-center">
      Don't have an account?
      <a href="#" @click="changeToRegisterMode"> Register </a>
    </p>
  </div>
</template>
