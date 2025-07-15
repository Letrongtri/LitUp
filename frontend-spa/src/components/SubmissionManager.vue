<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from '@/services/litup_service';

const props = defineProps({
  assignmentId: Number,
  assignmentTitle: String,
});

const submissions = ref([]);
const selectedSubmission = ref(null);
const error = ref('');

async function fetchSubmissions() {
  try {
    selectedSubmission.value = null;
    const result = await api.getSubmissions(props.assignmentId, 1, 10);
    submissions.value = result.submissions || [];
  } catch (err) {
    error.value = 'Không tải được submissions: ' + err.message;
  }
}

async function viewSubmissionDetail(sid) {
  try {
    selectedSubmission.value = await api.getSubmission(sid);
  } catch (err) {
    error.value = 'Lỗi khi xem chi tiết submission: ' + err.message;
  }
}

async function gradeSubmission(sid) {
  try {
    const { s_grade, s_comment } = selectedSubmission.value;
    await api.gradeSubmission(sid, { s_grade, s_comment });
    alert('✅ Đã chấm điểm!');
  } catch (err) {
    error.value = 'Chấm điểm thất bại: ' + err.message;
  }
}

onMounted(fetchSubmissions);
watch(() => props.assignmentId, fetchSubmissions);
</script>

<template>
  <div class="mt-4">
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <h5>📥 Danh sách nộp bài: {{ assignmentTitle }}</h5>
    <ul v-if="submissions.length" class="list-group">
      <li
        v-for="s in submissions"
        :key="s.sid"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          Học sinh: {{ s.uid }} |
          Trạng thái: {{ s.s_status }} |
          Điểm: {{ s.s_grade ?? 'Chưa chấm' }}
        </span>
        <button class="btn btn-sm btn-outline-info" @click="viewSubmissionDetail(s.sid)">
          Xem chi tiết
        </button>
      </li>
    </ul>
    <p v-else>Chưa có học sinh nào nộp bài.</p>

    <div v-if="selectedSubmission" class="mt-3">
      <h6>📝 Chi tiết submission</h6>
      <p>UID: {{ selectedSubmission.uid }}</p>
      <p>Trạng thái: {{ selectedSubmission.s_status }}</p>
      <p>Ngày nộp: {{ selectedSubmission.s_submitted_at }}</p>

      <div class="mb-2">
        <label>Điểm:</label>
        <input v-model.number="selectedSubmission.s_grade" type="number" class="form-control" />
      </div>
      <div class="mb-2">
        <label>Nhận xét:</label>
        <textarea v-model="selectedSubmission.s_comment" class="form-control" />
      </div>
      <button class="btn btn-success" @click="gradeSubmission(selectedSubmission.sid)">
        💾 Lưu điểm
      </button>
    </div>
  </div>
</template>
