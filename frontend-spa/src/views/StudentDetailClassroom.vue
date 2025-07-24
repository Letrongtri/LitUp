<script setup>
import classroomsService from '@/services/classrooms.service';
import { useRoute } from 'vue-router';

import { onMounted, ref } from 'vue';
import AssignmentList from '@/components/AssignmentList.vue';

const route = useRoute();
const cid = Number(route.params?.cid);
let classroom = ref({});
let assignments = ref([]);

async function retrieveClassroom(cid) {
  try {
    const data = await classroomsService.getClassroom(cid);
    classroom.value = data.classroom;
  } catch (error) {
    console.log(error);
  }
}

async function retrieveAsignments(cid) {
  try {
    const data = await classroomsService.getClassroomAssignment(cid);
    assignments.value = data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await retrieveClassroom(cid);
  console.log(classroom.value);

  await retrieveAsignments(cid);
});
</script>

<template>
  <div class="page-container bg-light">
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <h2 class="fw-bold text-primary mb-1">{{ classroom.c_name }}</h2>
        <div class="d-flex align-items-center gap-2 text-muted mt-3">
          <img :src="classroom.teacher_avatar_url" class="rounded-circle" width="35" height="35" />
          <p class="m-0 ms-2">{{ classroom.teacher_name }}</p>
        </div>
      </div>
    </div>

    <div class="container py-4">
      <!-- <div
        v-if="assignments.length > 0"
        class="assignment-section bg-white shadow-sm rounded border table-hover"
      >
        <div
          v-for="assignment in assignments"
          :key="assignment.aid"
          class="assignment-item border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
        >
          <div class="flex-grow-1">
            <h5 class="fw-semibold text-dark mb-3">{{ assignment.a_title }}</h5>
            <p class="mb-2">
              <strong>Description: </strong>
              {{ assignment.a_description }}
            </p>
            <div class="row">
              <div class="col-md-6">
                <p class="mb-2">
                  <strong>Deadline:</strong> {{ formatDate(assignment.a_deadline_at) }}
                </p>
                <p class="mb-2"><strong>Status:</strong> Hết hạn</p>
              </div>
              <div class="col-md-6">
                <p class="mb-2"><strong>Max point: </strong> {{ assignment.a_max_points }}</p>
                <p class="mb-2">
                  <strong>Attachments:</strong> {{ assignment.attachments.length }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> -->

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