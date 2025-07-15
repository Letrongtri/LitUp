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

onMounted(async () => {
  try {
    const res = await api.getClassroomDetail(cid);
    className.value = res?.classroom?.c_name || '';
  } catch (err) {
    error.value = 'Không thể tải thông tin lớp học';
  }
});

async function updateClassroom() {
  error.value = '';
  message.value = '';

  try {
    await api.updateClassroom(cid, { c_name: className.value });
    message.value = 'Cập nhật lớp học thành công!';
    setTimeout(() => router.push({ name: 'classrooms' }), 1000);
  } catch (err) {
    error.value = 'Cập nhật thất bại: ' + err.message;
  }
}
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="form-box bg-white shadow rounded p-4 p-md-5">
        <h2 class="mb-4 text-primary fw-bold">Cập nhật lớp học</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <form @submit.prevent="updateClassroom">
          <div class="mb-3">
            <label for="className" class="form-label fw-semibold">Tên lớp học *</label>
            <input
              id="className"
              type="text"
              v-model="className"
              class="form-control"
              required
              placeholder="VD: Lập trình Web 1"
            />
          </div>

          <button type="submit" class="btn btn-primary px-4 py-2">
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

.form-box {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
}

input.form-control {
  border-radius: 10px;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}
</style>
