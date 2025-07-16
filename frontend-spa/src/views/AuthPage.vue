<script setup>
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

import '../assets/css/auth.css';

const mode = ref('login');
const errorMsg = ref('');
const successMsg = ref('');
</script>

<template>
  <div class="auth-container">
    <!-- Left welcome section -->
    <div class="auth-left">
      <div class="welcome-text">
        <h1>Welcome to LitUp!</h1>
        <p>
          Nền tảng học tập trực tuyến giúp bạn tham gia lớp học, theo dõi bài tập, và phát triển mỗi
          ngày.
        </p>
      </div>
    </div>

    <!-- Right login/register form -->
    <div class="auth-right">
      <div class="form-box">
        <h3 class="text-center mb-4">{{ mode === 'login' ? 'LOGIN' : 'REGISTER' }}</h3>

        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

        <LoginForm
          v-if="mode == 'login'"
          @change-mode="mode = $event"
          @set-error="errorMsg = $event"
          @set-success="successMsg = $event"
        />

        <RegisterForm
          v-else-if="mode == 'register'"
          @change-mode="mode = $event"
          @set-error="errorMsg = $event"
          @set-success="successMsg = $event"
        />
      </div>
    </div>
  </div>
</template>
