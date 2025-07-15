<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/litup_service';

const className = ref('');
const message = ref('');
const error = ref('');
const router = useRouter();

async function submit() {
  error.value = '';
  message.value = '';

  try {
    const stored = JSON.parse(localStorage.getItem('user'));
    const uid = stored?.uid || stored?.u_id;
    if (!uid) throw new Error('Không tìm thấy UID');

    await api.createClassroom(uid, className.value);
    message.value = 'Tạo lớp học thành công!';
    className.value = '';

    setTimeout(() => router.push({ name: 'classrooms' }), 1000);
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="form-box bg-white shadow rounded p-4 p-md-5">
        <h2 class="mb-4 text-primary fw-bold">Tạo lớp học mới</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="className" class="form-label fw-semibold">Tên lớp học *</label>
            <input
              id="className"
              type="text"
              v-model="className"
              class="form-control"
              placeholder="VD: Toán 12A3, Lập trình Web 1..."
              required
            />
          </div>

          <button type="submit" class="btn btn-primary px-4 py-2">
            Tạo lớp học
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
