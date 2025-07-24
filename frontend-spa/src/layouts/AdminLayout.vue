<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const tab = ref('overview');
const route = useRoute();
const router = useRouter();
provide('tab', tab);

function goToDashboardPage() {
  if (route.name === 'admin.dashboard') return;
  //
  tab.value = 'overview';
  router.push('/admin/dashboard');
}

function goToUsersManagementPage() {
  if (route.name === 'admin.users') return;
  router.push('/admin/users');
}

function goToClassroomsManagementPage() {
  if (route.name === 'admin.classrooms') return;
  router.push('/admin/classrooms');
}

function goToAssignmentsManagementPage() {
  if (route.name === 'admin.assignments') return;
  router.push('/admin/assignments');
}

function goToSubmissionsManagementPage() {
  if (route.name === 'admin.submissions') return;
  router.push('/admin/submissions');
}
</script>

<template>
  <AppHeader />
  <main class="py-4 px-0 w-100">
    <div class="page-container">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Admin Panel</h1>
          <p class="page-subtitle">Overview of classroom system operations</p>
        </div>
      </div>

      <!-- Tabs nav -->
      <div class="tabs-nav border-bottom bg-white">
        <div class="container d-flex gap-4 px-3 py-2">
          <div
            class="tab-item"
            :class="tab === 'overview' ? 'active' : ''"
            @click="goToDashboardPage"
          >
            Overview
          </div>
          <div
            class="tab-item"
            :class="tab === 'users' ? 'active' : ''"
            @click="goToUsersManagementPage"
          >
            Users
          </div>
          <div
            class="tab-item"
            :class="tab === 'classrooms' ? 'active' : ''"
            @click="goToClassroomsManagementPage"
          >
            Classrooms
          </div>
          <div
            class="tab-item"
            :class="tab === 'assignments' ? 'active' : ''"
            @click="goToAssignmentsManagementPage"
          >
            Assignments
          </div>
          <div
            class="tab-item"
            :class="tab === 'submissions' ? 'active' : ''"
            @click="goToSubmissionsManagementPage"
          >
            Submissions
          </div>
        </div>
      </div>

      <RouterView />
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff; 
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #343a40; 
}

.tabs-nav {
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.tab-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.375rem;
  color: #444;
  transition: background 0.2s;
  font-size: 1rem;
}

.tab-item:hover {
  background: #f0f0f0;
}

.tab-item.active {
  background: #e7f1ff;
  color: #007bff;
}
</style>