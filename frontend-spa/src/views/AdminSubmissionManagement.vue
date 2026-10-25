<script setup>
import MainPagination from '@/components/MainPagination.vue';
import { useSubmissionsByAdmin } from '@/composables/useAdmin';
import { formatDate } from '@/utils/format';
import { computed, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const tab = inject('tab');
tab.value = 'submissions';

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});
const currentLimit = computed(() => {
  const limit = Number(route.query?.limit);
  if (Number.isNaN(limit) || limit < 1) return 10;
  return limit;
});

const { data, isLoading, error, refetch } = useSubmissionsByAdmin(currentPage, currentLimit);
const submissions = computed(() => data.value?.submissions || []);
const totalPages = computed(() => data.value?.metadata.lastPage || 1);

const searchText = ref('');
const searchableSubmissions = computed(() =>
  submissions.value.map((submission) => {
    const { sid, s_status, aid, uid } = submission;
    return [sid, s_status, aid, uid].join('').toLowerCase();
  }),
);

const selectedIndex = ref(-1);
const selectedSubmission = computed(() => {
  if (selectedIndex.value < 0) return null;
  return submissions.value[selectedIndex.value];
});

const filteredSubmissions = computed(() => {
  if (!searchText.value) return submissions.value;
  return submissions.value.filter((submission, index) =>
    searchableSubmissions.value[index].includes(searchText.value),
  );
});

function changeCurrentPage(page) {
  router.push({ name: 'admin.submissions', query: { page, limit: currentLimit.value } });
}

function dowloadFile(attachment) {
  if (!attachment) {
    console.error('File not found.');
    return;
  }

  const link = document.createElement('a');
  link.href = `/uploads/${attachment.f_name}`;
  link.download = attachment.f_original_name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="page-container">
    <div class="container">
      <div class="content-section">
        <div class="section-header">
          <h3>Submissions management</h3>
          <div class="search-box">
            <input
              type="text"
              v-model="searchText"
              class="form-control"
              placeholder="Search by ID or UserID..."
            />
            <button class="btn btn-primary">Find</button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else class="row">
          <div class="col-md-8">
            <table class="user-table table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Assignment ID</th>
                  <th>Submitted at</th>
                  <th>Attachments</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(submission, index) in filteredSubmissions"
                  :key="submission.sid"
                  :class="{ 'table-active': index === selectedIndex }"
                  @click="selectedIndex = index"
                >
                  <td>{{ submission.sid }}</td>
                  <td>{{ submission.uid }}</td>
                  <td>{{ submission.aid }}</td>
                  <td>{{ formatDate(submission.s_submitted_at) }}</td>
                  <td>{{ submission.attachments.length }}</td>
                  <td>{{ submission.s_status }}</td>
                </tr>
              </tbody>
            </table>

            <div class="">
              <MainPagination
                :total-pages="totalPages"
                :current-page="currentPage"
                @update:current-page="changeCurrentPage"
              />
            </div>
          </div>

          <div v-if="selectedSubmission" class="col-md-4">
            <div class="card p-3">
              <div class="p-1">
                <strong>ID: </strong>
                {{ selectedSubmission.aid }}
              </div>
              <div class="p-1">
                <strong>User ID: </strong>
                {{ selectedSubmission.uid }}
              </div>
              <div class="p-1">
                <strong>Assignment ID: </strong>
                {{ selectedSubmission.aid }}
              </div>
              <div class="p-1">
                <strong>Status: </strong>
                {{ selectedSubmission.s_status }}
              </div>
              <div class="p-1">
                <strong>Grade: </strong>
                {{ selectedSubmission.s_grade }}
              </div>
              <div class="p-1">
                <strong>Created at: </strong>
                {{ formatDate(selectedSubmission.s_created_at) }}
              </div>
              <div class="p-1">
                <strong>Updated at: </strong>
                {{ formatDate(selectedSubmission.s_updated_at) }}
              </div>
              <div class="p-1">
                <strong>Graded at: </strong>
                {{ formatDate(selectedSubmission.s_graded_at) }}
              </div>
              <div class="p-1">
                <strong>Comment: </strong>
                {{ selectedSubmission.s_comment }}
              </div>
              <div class="p-1">
                <strong>Attachments: </strong>
                {{ selectedSubmission.attachments.length }}
              </div>
              <div class="p-1 mb-3">
                <ul class="list-group">
                  <li
                    class="list-group-item px-3"
                    v-for="file in selectedSubmission.attachments"
                    :key="file.fid"
                    @click="dowloadFile(file)"
                  >
                    {{ file.f_original_name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}
.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.search-box {
  display: flex;
  gap: 0.5rem;
}
.search-box .form-control {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 250px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th,
.user-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.user-table th {
  background-color: #f8f9fa;
  color: #333;
}
.user-table td button {
  margin-right: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-outline {
  background: white;
  border: 1px solid #ccc;
  color: #333;
}
.btn-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
}
</style>
