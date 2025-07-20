<script setup>
import { useRouter } from 'vue-router';

defineProps({
  classrooms: { type: Array, default: () => [] },
});

const router = useRouter();

function goToClassroom(id) {
  router.push({ name: 'student.class.detail', params: { cid: id } });
}
</script>

<template>
  <div class="classrooms-grid" v-if="classrooms.length > 0">
    <div v-for="classroom in classrooms" class="classroom-card" :key="classroom.cid">
      <div class="card-header">
        <h4>{{ classroom.c_name }}</h4>
        <p>Teacher: {{ classroom.teacher_name }}</p>
      </div>
      <div class="card-body">
        <div class="card-actions">
          <button class="btn btn-primary" @click="goToClassroom(classroom.cid)">Detail</button>
        </div>
      </div>
    </div>

    <!-- <div class="classroom-card">
        <div class="card-header">
          <h4>Lớp Văn 12B2</h4>
        </div>
        <div class="card-body">
          <div class="card-actions">
            <button class="btn btn-primary">Xem bài tập</button>
          </div>
        </div>
      </div> -->
  </div>
</template>
