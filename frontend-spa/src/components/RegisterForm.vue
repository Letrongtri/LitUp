<!-- src/components/RegisterForm.vue -->
<script setup>
import { ref, defineEmits } from 'vue';
import authService from '@/services/auth.service';

const emit = defineEmits(['change-mode', 'set-success', 'set-error']);

const registerForm = ref({
  u_first_name: '',
  u_last_name: '',
  u_email: '',
  u_password: '',
  u_role: '',
});

const confirmPassword = ref('');

async function handleRegister() {
  if (registerForm.value.u_password !== confirmPassword.value) {
    emit('set-error', 'Confirmation password does not match!');
    return;
  }

  try {
    await authService.register(registerForm.value);

    emit('set-error', '');
    emit('set-success', 'Registration successful! You can log in.');
  } catch (err) {
    emit('set-error', err.message || 'Registration failed!');
  }
}

function changeToLoginMode() {
  emit('change-mode', 'login');
}
</script>

<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <input
          v-model="registerForm.u_first_name"
          type="text"
          class="form-control mb-2"
          placeholder="First name"
        />
      </div>

      <div class="col">
        <input
          v-model="registerForm.u_last_name"
          type="text"
          class="form-control mb-2"
          placeholder="Last name"
        />
      </div>
    </div>

    <input
      v-model="registerForm.u_email"
      type="email"
      class="form-control mb-3"
      placeholder="Email"
    />
    <input
      v-model="registerForm.u_password"
      type="password"
      class="form-control mb-3"
      placeholder="Password"
    />
    <input
      v-model="confirmPassword"
      type="password"
      class="form-control mb-3"
      placeholder="Enter password again"
    />
    <select v-model="registerForm.u_role" class="form-select mb-3">
      <option selected disabled value="">Choose your role</option>
      <option value="student">I'm a student</option>
      <option value="teacher">I'm a teacher</option>
    </select>

    <div class="d-flex justify-content-between align-items-center mb-3 text-muted small">
      <div><input type="checkbox" class="form-check-input me-1" /> Remember me</div>
    </div>

    <button class="btn btn-gradient w-100 mb-3" @click="handleRegister">Register</button>

    <p class="text-center">
      Already have an account?
      <a href="#" @click="changeToLoginMode"> Log in </a>
    </p>
  </div>
</template>
