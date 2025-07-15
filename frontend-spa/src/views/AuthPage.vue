<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/litup_service';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const mode = ref('login');
const firstName = ref('');
const lastName = ref('');
const role = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const successMsg = ref('');

async function handleSubmit() {
  errorMsg.value = '';
  successMsg.value = '';

  if (mode.value === 'register') {
    if (password.value !== confirmPassword.value) {
      errorMsg.value = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    try {
      await api.register({
        u_first_name: firstName.value,
        u_last_name: lastName.value,
        u_email: email.value,
        u_password: password.value,
        u_role: role.value,
      });

      successMsg.value = '🎉 Đăng ký thành công!';
      setTimeout(() => (mode.value = 'login'), 1500);
    } catch (err) {
      errorMsg.value = err.message || 'Đăng ký thất bại!';
    }
  } else {
    try {
      const result = await api.login({
        u_email: email.value,
        u_password: password.value,
      });

      const user = result.user?.user;
      if (!user?.uid) throw new Error('Phản hồi không hợp lệ');

      userStore.setUser({ ...user, token: result.token });
      router.push('/');
    } catch (err) {
      errorMsg.value = err.message || 'Đăng nhập thất bại!';
    }
  }
}
</script>

<template>
  <div class="auth-container">
    <!-- Left welcome section -->
    <div class="auth-left">
      <div class="welcome-text">
        <h1>Welcome to LitUp!</h1>
        <p>
          Nền tảng học tập trực tuyến giúp bạn tham gia lớp học, theo dõi bài tập, và phát triển mỗi ngày.
        </p>
      </div>
    </div>

    <!-- Right login/register form -->
    <div class="auth-right">
      <div class="form-box">
        <h3 class="text-center mb-4">{{ mode === 'login' ? 'USER LOGIN' : 'REGISTER' }}</h3>

        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

        <div v-if="mode === 'register'" class="row mb-3">
          <div class="col">
            <input v-model="firstName" class="form-control" placeholder="Họ" />
          </div>
          <div class="col">
            <input v-model="lastName" class="form-control" placeholder="Tên" />
          </div>
        </div>

        <input v-model="email" type="email" class="form-control mb-3" placeholder="Email" />
        <input v-model="password" type="password" class="form-control mb-3" placeholder="Mật khẩu" />

        <input
          v-if="mode === 'register'"
          v-model="confirmPassword"
          type="password"
          class="form-control mb-3"
          placeholder="Nhập lại mật khẩu"
        />

        <select v-if="mode === 'register'" v-model="role" class="form-select mb-3">
          <option disabled value="">Chọn vai trò</option>
          <option value="student">🎓 Học sinh</option>
          <option value="teacher">👨‍🏫 Giáo viên</option>
        </select>

        <div class="d-flex justify-content-between align-items-center mb-3 text-muted small">
          <div><input type="checkbox" class="form-check-input me-1" /> Remember</div>
        </div>

        <button class="btn btn-gradient w-100 mb-3" @click="handleSubmit">
          {{ mode === 'login' ? 'LOGIN' : 'REGISTER' }}
        </button>

        <div class="text-center">
          <small>
            {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
            <a href="#" @click.prevent="mode = mode === 'login' ? 'register' : 'login'">
              {{ mode === 'login' ? 'Sign up' : 'Login' }}
            </a>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* Left section */
.auth-left {
  width: 50%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.welcome-text h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.welcome-text p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Right section */
.auth-right {
  width: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-box {
  width: 100%;
  max-width: 380px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
}

/* Gradient button */
.btn-gradient {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 0;
  transition: background 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(to right, #5b0bcc, #1f63e1);
}

input.form-control,
select.form-select {
  border-radius: 10px;
}

.alert {
  border-radius: 8px;
  font-size: 0.9rem;
}
</style>
