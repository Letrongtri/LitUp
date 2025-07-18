<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const user = JSON.parse(localStorage.getItem('user')).user;

// const user = JSON.parse(localStorage.getItem('user') || 'null') || {
//   u_first_name: 'Demo',
//   u_last_name: 'User',
//   u_role: 'teacher',
//   avatar_url: '/uploads/avatar1.png'
// };


function handleLogout() {
  localStorage.removeItem('user');
  router.push('/auth');
}

function goToProfilePage(uid) {
  router.push({ name: 'profile', params: { uid } });
}

function goToHomePage() {
  router.push('/');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary px-3">
    <div class="container-fluid">
      <a class="navbar-brand" href="" @click="goToHomePage">LitUp!</a>
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

        <div class="dropdown d-flex justify-content-end gap-3" style="max-width: 300px">
          <a
            class="d-flex align-items-center link-dark text-decoration-none"
            id="dropdownUser2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="cursor: pointer"
          >
            <strong class="dropdown-toggle">{{ user.u_first_name }} {{ user.u_last_name }}</strong>
            <img
              :src="`http://localhost:3000${user.avatar_url}`"
              :alt="user.u_first_name + ' ' + user.u_last_name"
              width="32"
              height="32"
              class="rounded-circle me-2 ms-2"
            />
          </a>
          <ul
            class="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser2"
            style="left: auto; right: 0"
          >
            <li><a class="dropdown-item" href="#">New project...</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><a class="dropdown-item" @click="goToProfilePage(user.uid)">Profile</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" @click="handleLogout">Sign out</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>
