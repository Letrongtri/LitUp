<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/litup_service';

const route = useRoute();
const router = useRouter();

const cid = Number(route.params.cid);
const title = ref('');
const description = ref('');
const maxPoints = ref('');
const deadline = ref('');
const allowLate = ref(false);
const files = ref([]);
const message = ref('');
const error = ref('');

async function submit() {
  error.value = '';
  message.value = '';

  try {
    const formData = new FormData();
    formData.append('a_title', title.value);
    formData.append('a_description', description.value);
    formData.append('a_max_points', maxPoints.value);
    formData.append('a_deadline_at', deadline.value);
    formData.append('a_allow_late_submission', allowLate.value);

    for (const file of files.value) {
      formData.append('attachments', file);
    }

    await api.createAssignmentWithFiles(cid, formData);
    message.value = 'Tạo bài tập thành công!';
    setTimeout(() => router.push({ name: 'classrooms' }), 1000);
  } catch (err) {
    error.value = 'Tạo bài tập thất bại: ' + err.message;
  }
}
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="form-box shadow bg-white rounded p-4 p-md-5">
        <h2 class="mb-4 text-primary fw-bold">Tạo bài tập mới</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <form @submit.prevent="submit" enctype="multipart/form-data">
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiêu đề *</label>
            <input v-model="title" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả</label>
            <textarea v-model="description" class="form-control" rows="4"></textarea>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Điểm tối đa *</label>
              <input v-model="maxPoints" type="number" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Hạn nộp</label>
              <input v-model="deadline" type="date" class="form-control" />
            </div>
          </div>

          <div class="form-check form-switch mb-3">
            <input v-model="allowLate" type="checkbox" class="form-check-input" id="allowLate" />
            <label class="form-check-label" for="allowLate">Cho phép nộp muộn</label>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">File đính kèm</label>
            <input type="file" multiple class="form-control" @change="e => files.value = [...e.target.files]" />
          </div>

          <button type="submit" class="btn btn-primary px-4 py-2">
             Tạo bài tập
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
  max-width: 700px;
  margin: 0 auto;
  border-radius: 12px;
}

input.form-control,
textarea.form-control,
select.form-control {
  border-radius: 10px;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
}
</style>
