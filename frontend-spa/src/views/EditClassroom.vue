<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/litup_service';

const route = useRoute();
const router = useRouter();
const cid = route.params.cid;

const className = ref('');
const error = ref('');
const message = ref('');

// Load thông tin lớp khi component được mount
onMounted(async () => {
  try {
    const res = await api.getClassroomDetail(cid);
    className.value = res?.classroom?.c_name || '';
  } catch (err) {
    error.value = 'Không thể tải thông tin lớp học';
  }
});

// Gửi yêu cầu cập nhật lớp học
async function updateClassroom() {
  error.value = '';
  message.value = '';

  try {
    await api.updateClassroom(cid, { c_name: className.value });
    message.value = 'Cập nhật lớp học thành công!';
    setTimeout(() => {
      router.push({ name: 'classrooms' }); // quay về danh sách lớp
    }, 1000);
  } catch (err) {
    error.value = 'Cập nhật thất bại: ' + err.message;
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Cập nhật lớp học</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <form @submit.prevent="updateClassroom" class="mt-3">
      <div class="mb-3">
        <label for="className" class="form-label">Tên lớp học</label>
        <input
          type="text"
          id="className"
          v-model="className"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </form>
  </div>
</template>
