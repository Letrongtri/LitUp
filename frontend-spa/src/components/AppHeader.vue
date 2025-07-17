<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
  localStorage.removeItem('user');
  router.push('/auth');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary px-3">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">LitUp!</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
        <router-link
          v-if="user && user.u_role === 'teacher'"
          to="/classrooms/create"
          class="btn btn-outline-success btn-sm me-2"
        >
          <i class="fas fa-plus me-1"></i> Tạo lớp học
        </router-link>

        <router-link to="/profile" class="btn btn-primary btn-sm me-2"> Hồ sơ </router-link>

        <button class="btn btn-outline-danger btn-sm" @click="handleLogout">Đăng xuất</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>
