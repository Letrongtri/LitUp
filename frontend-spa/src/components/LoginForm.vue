<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLogin } from '@/composables/useAuth';

const router = useRouter();
const authStore = useAuthStore();
const loginMutation = useLogin();

const loginForm = ref({
  u_email: '',
  u_password: '',
});

const emit = defineEmits(['change-mode', 'set-success', 'set-error']);

async function handleLogin() {
  try {
    const result = await loginMutation.mutateAsync(loginForm.value);

    // Lưu token vào store
    authStore.setToken(result.data.token);
    await authStore.fetchMe();

    emit('set-error', '');
    emit('set-success', 'Log in successful!');

    const role = authStore.user?.u_role;
    if (role === 'admin') router.replace('/admin/dashboard');
    else if (role === 'teacher') router.replace('/teacher/classrooms');
    else if (role === 'student') router.replace('/student/classrooms');
    else router.replace('/');
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
