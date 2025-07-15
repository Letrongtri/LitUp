<template>
  <div class="container mt-5" style="max-width: 600px;">
    <h2>Hồ sơ người dùng</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="user">
      <p><strong>Họ tên:</strong> {{ user.u_first_name }} {{ user.u_last_name }}</p>
      <p><strong>Email:</strong> {{ user.u_email }}</p>
      <p><strong>Vai trò:</strong> {{ user.u_role }}</p>
      <p><strong>Trạng thái:</strong> {{ user.u_status ? 'Đang hoạt động' : 'Bị khóa' }}</p>
    </div>

    <div v-else-if="!error">Đang tải thông tin...</div>

    <router-link to="/dashboard" class="btn btn-secondary mt-3">
      ⬅️ Quay lại Dashboard
    </router-link>
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
