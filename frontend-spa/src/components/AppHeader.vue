<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a class="navbar-brand" href="#">Lit Up</a>
  
      <div class="ms-auto d-flex align-items-center">
        <!-- ✅ Chỉ giáo viên mới thấy nút tạo lớp -->
        <router-link
          v-if="user && user.u_role === 'teacher'"
          to="/classrooms/create"
          class="btn btn-outline-success btn-sm me-2"
        >
          <i class="fas fa-plus me-1"></i> Tạo lớp học
        </router-link>
  
        <router-link to="/profile" class="btn btn-outline-light btn-sm me-2">
          Hồ sơ
        </router-link>
  
        <button class="btn btn-outline-danger btn-sm" @click="handleLogout">
          Đăng xuất
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import { storeToRefs } from 'pinia';
  
  const router = useRouter();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore); // reactive binding
  
  function handleLogout() {
    userStore.logout();
    router.push('/auth');
  }
  </script>
  
  <style scoped>
  .navbar-brand {
    font-weight: bold;
  }
  </style>
  