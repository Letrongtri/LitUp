<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/litup_service';

const route = useRoute();
const router = useRouter();

const aid = Number(route.params.aid);
const title = ref('');
const description = ref('');
const maxPoints = ref(0);
const deadline = ref('');
const allowLate = ref(false);
const files = ref([]);
const message = ref('');
const error = ref('');

onMounted(async () => {
  try {
    const result = await api.getAssignment(aid);
    const assignment = result.assignment;

    title.value = assignment.a_title;
    description.value = assignment.a_description;
    maxPoints.value = assignment.a_max_points;
    deadline.value = assignment.a_deadline_at?.split('T')[0] || '';
    allowLate.value = assignment.a_allow_late_submission || false;
  } catch (err) {
    error.value = 'Không tải được bài tập: ' + err.message;
  }
});

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

    await api.updateAssignmentWithFiles(aid, formData);
    message.value = 'Cập nhật bài tập thành công!';
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
        <h2 class="mb-4 text-primary fw-bold">Chỉnh sửa bài tập</h2>

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
            <label class="form-label fw-semibold">File đính kèm mới (tùy chọn)</label>
            <input type="file" multiple class="form-control" @change="e => files.value = [...e.target.files]" />
          </div>

          <button type="submit" class="btn btn-primary px-4 py-2">
             Cập nhật bài tập
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
  border-radius: 16px;
}

input.form-control,
textarea.form-control,
select.form-control {
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
