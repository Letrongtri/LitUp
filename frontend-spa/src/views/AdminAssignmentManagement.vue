<script setup>
import MainPagination from '@/components/MainPagination.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/format';
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const assignments = ref([]);
const route = useRoute();
const router = useRouter();
const tab = inject('tab');

const totalPages = ref(1);
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

const searchText = ref('');
const searchableAssignments = computed(() =>
  assignments.value.map((assignment) => {
    const { a_title, aid, cid } = assignment;
    return [a_title, aid, cid].join('').toLowerCase();
  }),
);

const selectedIndex = ref(-1);
const selectedAssignment = computed(() => {
  if (selectedIndex.value < 0) return null;
  return assignments.value[selectedIndex.value];
});

const filteredAssignments = computed(() => {
  if (!searchText.value) return assignments.value;
  return assignments.value.filter((assignment, index) =>
    searchableAssignments.value[index].includes(searchText.value),
  );
});

async function retrieveAssignments(page) {
  try {
    const data = await adminService.getAssignmentsByAdmin(page, currentLimit.value);
    assignments.value = data.assignments;
    totalPages.value = data.metadata.lastPage ?? 1;
  } catch (error) {
    console.log(error);
  }
}

async function deactivateAssignment(aid) {
  if (confirm('Do you want to deactivate this assignment?')) {
    try {
      await adminService.editAssignment(aid, { a_status: false });
      selectedAssignment.value.a_status = false;
    } catch (error) {
      console.log(error);
    }
  }
}

async function activateAssignment(aid) {
  if (confirm('Do you want to activate this assignment?')) {
    try {
      await adminService.editAssignment(aid, { a_status: true });
      selectedAssignment.value.a_status = true;
    } catch (error) {
      console.log(error);
    }
  }
}

function changeCurrentPage(page) {
  router.push({ name: 'admin.assignments', query: { page, limit: currentLimit.value } });
}

function dowloadFile(attachment) {
  if (!attachment) {
    console.error('File not found.');
    return;
  }

  const link = document.createElement('a');
  link.href = `/public/uploads/${attachment.f_name}`;
  link.download = attachment.f_original_name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onMounted(() => {
  tab.value = 'assignments';
});

watch(currentPage, () => retrieveAssignments(currentPage.value), { immediate: true });
</script>

<template>
  <div class="page-container">
    <div class="container">
      <div class="content-section">
        <div class="section-header">
          <h3>Assignments management</h3>
          <div class="search-box">
            <input
              type="text"
              v-model="searchText"
              class="form-control"
              placeholder="Tìm theo tên hoặc email..."
            />
            <button class="btn btn-primary">Tìm</button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <table class="user-table table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Classroom ID</th>
                  <th>Created at</th>
                  <th>Attachments</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(assignment, index) in filteredAssignments"
                  :key="assignment.aid"
                  :class="{ 'table-active': index === selectedIndex }"
                  @click="selectedIndex = index"
                >
                  <td>{{ assignment.aid }}</td>
                  <td>{{ assignment.a_title }}</td>
                  <td>{{ assignment.cid }}</td>
                  <td>{{ formatDate(assignment.a_created_at) }}</td>
                  <td>{{ assignment.attachments.length }}</td>
                  <td>{{ assignment.a_status ? 'Active' : 'Inactive' }}</td>
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

          <div v-if="selectedAssignment" class="col-md-4">
            <div class="card p-3">
              <div class="p-1">
                <strong>ID: </strong>
                {{ selectedAssignment.aid }}
              </div>
              <div class="p-1">
                <strong>Title: </strong>
                {{ selectedAssignment.a_title }}
              </div>
              <div class="p-1">
                <strong>Descriptions: </strong>
                {{ selectedAssignment.a_description }}
              </div>
              <div class="p-1">
                <strong>Max points: </strong>
                {{ selectedAssignment.a_max_points }}
              </div>
              <div class="p-1">
                <strong>Status: </strong>
                {{ selectedAssignment.a_status ? 'Active' : 'Inactive' }}
              </div>
              <div class="p-1">
                <strong>Created at: </strong>
                {{ formatDate(selectedAssignment.a_created_at) }}
              </div>
              <div class="p-1">
                <strong>Updated at: </strong>
                {{ formatDate(selectedAssignment.a_updated_at) }}
              </div>
              <div class="p-1">
                <strong>Deadline at: </strong>
                {{ formatDate(selectedAssignment.a_deadline_at) }}
              </div>
              <div class="p-1">
                <strong>Late submission: </strong>
                {{ selectedAssignment.a_allow_late_submission }}
              </div>
              <div class="p-1">
                <strong>Attachments: </strong>
                {{ selectedAssignment.attachments.length }}
              </div>
              <div class="p-1 mb-3">
                <ul class="list-group">
                  <li
                    class="list-group-item px-3"
                    v-for="file in selectedAssignment.attachments"
                    :key="file.fid"
                    @click="dowloadFile(file)"
                  >
                    {{ file.f_original_name }}
                  </li>
                </ul>
              </div>
              <div class="p-1 text-end">
                <button
                  v-if="selectedAssignment.a_status"
                  @click="deactivateAssignment(selectedAssignment.aid)"
                  class="btn btn-danger"
                >
                  Deactivate
                </button>
                <button
                  v-else
                  @click="activateAssignment(selectedAssignment.aid)"
                  class="btn btn-success"
                >
                  Activate
                </button>
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
