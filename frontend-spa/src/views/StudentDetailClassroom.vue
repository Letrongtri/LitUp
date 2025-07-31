<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import AssignmentList from '@/components/AssignmentList.vue';
import { useClassroomAssignments, useClassroomDetail } from '@/composables/useClassroom';

const route = useRoute();
const cid = Number(route.params?.cid);

const {
  data: detailData,
  isLoading: isLoadingDetail,
  error: errorDetail,
  refetch: refetchDetail,
} = useClassroomDetail(cid);
let classroom = computed(() => detailData.value?.classroom || {});

const {
  data: assignmentData,
  isLoading: isLoadingAssignments,
  error: errorAssignments,
  refetch: refetchAssignments,
} = useClassroomAssignments(cid);
let assignments = computed(() => assignmentData.value || []);
</script>

<template>
  <div v-if="isLoadingDetail" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="page-container bg-light">
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <h2 class="fw-bold text-primary mb-1">{{ classroom.c_name }}</h2>
        <div class="d-flex align-items-center gap-2 text-muted mt-3">
          <img
            :src="classroom.teacher_avatar_url"
            class="rounded-circle"
            width="35"
            height="35"
            style="object-fit: cover"
          />
          <p class="m-0 ms-2">{{ classroom.teacher_name }}</p>
        </div>
      </div>
    </div>

    <div v-if="isLoadingAssignments" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="container py-4">
      <AssignmentList v-if="assignments.length > 0" :assignments="assignments" :role="'student'" />
      <p class="text-muted text-center py-3 mb-0" v-else>No exercises yet</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f6f9;
  min-height: 100vh;
}

.class-header {
  background: #fff;
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
}

.tab-item:hover {
  background: #f0f0f0;
}

.tab-item.active {
  background: #e7f1ff;
  color: #007bff;
}

.assignment-section {
  border-radius: 0.375rem !important;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
}

.class-header p,
.assignment-item p {
  font-size: 1.05rem;
}

.assignment-item h5 {
  font-size: 1.3rem;
  font-weight: 600;
}

.assignment-item strong {
  font-size: 1.05rem;
}

.text-muted {
  font-size: 1rem;
}
</style>
