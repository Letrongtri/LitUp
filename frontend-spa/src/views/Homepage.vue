<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useAuthStore().user;

function goToClassroomPage() {
  if (user.u_role == 'teacher') {
    router.push('/teacher/classrooms');
  } else if (user.u_role == 'student') {
    router.push('/student/classrooms');
  }
  if (user.u_role == 'admin') {
    router.push('/admin/dashboard');
  }
}
</script>

<template>
  <div class="homepage">
    <!-- Hero -->
    <section class="hero">
      <div class="grid-background"></div>
      <div class="hero-content container">
        <h1>A learning management system</h1>
        <p class="lead mt-3 mb-4">
          Online learning platform that helps you take classes, track assignments, and grow every
          day.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <a @click="goToClassroomPage" class="btn btn-primary px-4">Get Started</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.homepage {
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  height: 100vh;
  overflow-x: hidden;
}
.hero {
  position: relative;
  padding: 100px 15px;
  text-align: center;
  height: calc(100% - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero h1 {
  font-size: 3rem;
  font-weight: bold;
}
.hero h1 span {
  color: #0d6efd;
}
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.badge-announcement {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
