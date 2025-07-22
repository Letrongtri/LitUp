<script setup>
import submissionsService from '@/services/submissions.service';
import { formatDate } from '@/utils/format';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const sid = Number(route.params?.sid);
const submission = ref({});
const selectedIndex = ref(-1);
const grade = ref(0);
const comment = ref('');
const error = ref('');
const message = ref('');

async function retrieveSubmission() {
  try {
    const data = await submissionsService.getSubmissionByTeacher(sid);
    submission.value = data.submission;
  } catch (error) {
    console.log(error);
  }
}

const selectedFile = computed(() => {
  if (selectedIndex.value < 0) return null;
  return submission.value.attachments[selectedIndex.value];
});

onMounted(async () => {
  await retrieveSubmission();
  grade.value = submission.value.s_grade
    ? (submission.value.s_grade * 100) / submission.value.a_max_points
    : 0;
  comment.value = submission.value.s_comment ?? '';
});

function getFileViewerUrl(fileName) {
  const baseUrl = 'http://localhost:3000/public/uploads/' + fileName;
  const ext = fileName.split('.').pop().toLowerCase();

  if (['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'txt'].includes(ext)) {
    return baseUrl;
  }

  // Google Docs Viewer fallback
  return `https://docs.google.com/gview?url=${encodeURIComponent(baseUrl)}&embedded=true`;
}

async function gradeSubmission() {
  error.value = '';
  message.value = '';

  try {
    const data = {
      s_grade: (grade.value * 100) / submission.value.a_max_points,
      s_comment: comment.value,
    };

    await submissionsService.gradeSubmission(sid, data);
    message.value = 'Grade successfully!';
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<template>
  <div class="page-container bg-light py-4">
    <div class="container">
      <div class="bg-white p-4 rounded shadow-sm border" style="height: 100vh">
        <div class="row">
          <h3 class="fw-bold text-primary mb-3">{{ submission.a_title }}</h3>
        </div>

        <div class="d-flex flex-column flex-md-row gap-4" style="height: calc(100vh - 150px)">
          <!-- Bên trái: File báo cáo -->
          <div class="flex-fill">
            <iframe
              v-if="selectedFile"
              :src="getFileViewerUrl(selectedFile.f_name)"
              width="100%"
              height="100%"
              style="border: none"
            ></iframe>
          </div>

          <!-- Bên phải: Chi tiết và nhận xét -->
          <div class="flex-fill" style="max-width: 350px">
            <h6 class="fw-semibold">Thông tin sinh viên</h6>
            <ul class="list-unstyled small">
              <li><strong>Họ tên:</strong> {{ submission.u_name }}</li>
              <li><strong>Trạng thái:</strong> {{ submission.s_status }}</li>
              <li><strong>Ngày nộp:</strong> {{ formatDate(submission.s_submitted_at) }}</li>
            </ul>

            <hr />

            <!-- submitted attachment list -->

            <div class="my-3">
              <ul class="list-group">
                <li
                  class="list-group-item px-3"
                  v-for="(file, index) in submission.attachments"
                  :class="{ active: index === selectedIndex }"
                  :key="file.fid"
                  @click="selectedIndex = index"
                >
                  {{ file.f_original_name }}
                </li>
              </ul>
            </div>

            <hr />

            <h6 class="fw-semibold">Grade submission</h6>

            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="message" class="alert alert-success">{{ message }}</div>

            <form @submit.prevent="gradeSubmission">
              <div class="mb-3 d-flex align-items-center gap-1">
                <label for="grade" class="form-label fw-semibold m-0">Score:</label>
                <input id="grade" type="number" v-model="grade" class="form-control w-50" />
                <span>/ 100</span>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold m-0 me-1">Equivalent: </label>
                <span>
                  {{ (grade * 100) / submission.a_max_points }}/{{ submission.a_max_points }}
                </span>
              </div>

              <div class="mb-3">
                <label for="comment" class="form-label fw-semibold m-0"
                  >Instructor's Comment:</label
                >
                <textarea
                  id="comment"
                  v-model="comment"
                  class="form-control mb-2"
                  rows="4"
                  placeholder="Enter your feedback for the student..."
                ></textarea>
              </div>

              <div class="mb-3">
                <button type="submit" class="btn btn-primary btn-sm">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
