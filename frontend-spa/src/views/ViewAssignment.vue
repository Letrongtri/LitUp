<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/services/litup_service';

const route = useRoute();
const assignment = ref(null);
const error = ref('');

onMounted(async () => {
  try {
    const result = await api.getAssignment(route.params.aid);
    assignment.value = result.assignment;
  } catch (err) {
    error.value = 'Không tải được bài tập: ' + err.message;
  }
});
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="assignment-box bg-white shadow rounded p-4 p-md-5">
        <h2 class="mb-4 text-primary fw-bold">Chi tiết bài tập</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="assignment">
          <div class="mb-3">
            <label class="form-label fw-semibold">Tiêu đề:</label>
            <p class="fs-5">{{ assignment.a_title }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả:</label>
            <p>{{ assignment.a_description || 'Không có mô tả' }}</p>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label fw-semibold">Điểm tối đa:</label>
              <p>{{ assignment.a_max_points }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Hạn nộp:</label>
              <p>{{ assignment.a_deadline_at?.split('T')[0] || 'Không có' }}</p>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Nộp muộn:</label>
              <p>{{ assignment.a_allow_late_submission ? ' Có' : ' Không' }}</p>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">File đính kèm:</label>
            <ul v-if="assignment.attachments?.length" class="list-unstyled">
              <li v-for="(file, index) in assignment.attachments" :key="index">
                <a :href="file.filepath" target="_blank" rel="noopener">
                  {{ file.filename }}
                </a>
              </li>
            </ul>
            <p v-else class="text-muted">Không có file đính kèm.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

.assignment-box {
  max-width: 700px;
  margin: 0 auto;
  border-radius: 16px;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}

p {
  margin: 0;
}
</style>
