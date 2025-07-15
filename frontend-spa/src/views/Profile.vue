<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="profile-box bg-white shadow rounded p-4 p-md-5">
        <h2 class="mb-4 text-primary fw-bold">Hồ sơ người dùng</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="user">
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item">
              <strong>Họ tên:</strong> {{ user.u_first_name }} {{ user.u_last_name }}
            </li>
            <li class="list-group-item">
              <strong>Email:</strong> {{ user.u_email }}
            </li>
            <li class="list-group-item">
              <strong>Vai trò:</strong> {{ user.u_role === 'teacher' ? 'Giáo viên' : 'Học sinh' }}
            </li>
            <li class="list-group-item">
              <strong>Trạng thái:</strong>
              <span :class="user.u_status ? 'text-success' : 'text-danger'">
                {{ user.u_status ? 'Đang hoạt động' : 'Bị khóa' }}
              </span>
            </li>
          </ul>

          <router-link to="/dashboard" class="btn btn-outline-primary">
            Quay lại Dashboard
          </router-link>
        </div>

        <div v-else-if="!error" class="text-muted">Đang tải thông tin người dùng...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/litup_service';

const user = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    const profile = await api.getUserProfile();
    user.value = profile.user;
  } catch (err) {
    error.value = 'Lỗi khi tải hồ sơ: ' + err.message;
  }
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
}

.profile-box {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}

.list-group-item {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}
</style>
