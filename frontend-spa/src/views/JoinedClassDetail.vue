<script setup>
import classroomsService from '@/services/classrooms.service';
import { useRoute } from 'vue-router';

import { onMounted, ref } from 'vue';
import AssignmentStudentList from '@/components/AssignmentStudentList.vue';

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

onMounted(() => {
  retrieveClassroom(cid);
  retrieveAsignments(cid);
});
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container" v-if="classroom">
      <!-- Thông tin lớp -->
      <div class="class-box bg-white shadow-sm rounded-4 p-4 mb-5 border">
        <h2 class="mb-3 text-primary fw-bold">{{ classroom.c_name }}</h2>
        <p class="mb-1"><strong>Giáo viên:</strong> {{ classroom.teacher_name }}</p>
      </div>

      <!-- Danh sách bài tập -->
      <div class="assignment-section bg-white shadow-sm rounded-4 p-4 border">
        <h4 class="mb-4">Assignments</h4>

        <AssignmentStudentList v-if="assignments.length > 0" :assignments="assignments" />

        <p class="text-muted text-center mt-4" v-else>Chưa có bài tập nào</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f6f9;
}

.class-box {
  background: #fff;
}

.assignment-section {
  background: #fff;
}

.assignment-item h6 {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.35em 0.7em;
  border-radius: 12px;
}
</style>
