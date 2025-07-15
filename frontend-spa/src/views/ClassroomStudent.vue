<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/litup_service';

const classrooms = ref([]);
const error = ref('');
const user = JSON.parse(localStorage.getItem('user'));

onMounted(async () => {
  try {
    if (!user || user.u_role !== 'student') {
      throw new Error('Bạn chưa đăng nhập hoặc không phải học sinh');
    }

    const uid = user.uid;
    const rawClasses = await api.getStudentClassrooms(uid);

    if (!Array.isArray(rawClasses)) {
      throw new Error('Không lấy được danh sách lớp học');
    }

    classrooms.value = rawClasses.map(cls => ({
      ...cls,
      cid: cls.c_id ?? cls.cid,
    }));
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <div class="container mt-4">
    <h2>Lớp học bạn đã tham gia</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <ul class="list-group">
      <li
        v-for="cls in classrooms"
        :key="cls.cid"
        class="list-group-item"
      >
        {{ cls.c_name }}
        <!-- Sau này thêm nút "Xem bài tập" tại đây -->
      </li>
    </ul>
  </div>
</template>
