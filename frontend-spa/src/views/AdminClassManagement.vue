<script setup>
import MainPagination from '@/components/MainPagination.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/format';
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const classrooms = ref([]);
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
const searchableClassrooms = computed(() =>
  classrooms.value.map((classroom) => {
    const { c_name, teacher_name } = classroom;
    return [c_name, teacher_name].join('').toLowerCase();
  }),
);

const selectedIndex = ref(-1);
const selectedClassroom = computed(() => {
  if (selectedIndex.value < 0) return null;
  return classrooms.value[selectedIndex.value];
});

const filteredClassrooms = computed(() => {
  if (!searchText.value) return classrooms.value;
  return classrooms.value.filter((classroom, index) =>
    searchableClassrooms.value[index].includes(searchText.value),
  );
});

async function retrieveClassrooms(page) {
  try {
    const data = await adminService.getClassroomsByAdmin(page, currentLimit.value);
    classrooms.value = data.classrooms;
    totalPages.value = data.metadata.lastPage ?? 1;
  } catch (error) {
    console.log(error);
  }
}

async function deactivateClassroom(cid) {
  if (confirm('Do you want to deactivate this classroom?')) {
    try {
      await adminService.editClassroom(cid, { c_status: false });
      selectedClassroom.value.c_status = false;
    } catch (error) {
      console.log(error);
    }
  }
}

async function activateClassroom(cid) {
  if (confirm('Do you want to activate this classroom?')) {
    try {
      await adminService.editClassroom(cid, { c_status: true });
      selectedClassroom.value.c_status = true;
    } catch (error) {
      console.log(error);
    }
  }
}

function changeCurrentPage(page) {
  router.push({ name: 'admin.classrooms', query: { page, limit: currentLimit.value } });
}

onMounted(() => {
  tab.value = 'classrooms';
});

watch(currentPage, () => retrieveClassrooms(currentPage.value), { immediate: true });
</script>

<template>
  <div class="page-container">
    <div class="container">
      <div class="content-section">
        <div class="section-header">
          <h3>Classrooms management</h3>
          <div class="search-box">
            <input
              type="text"
              v-model="searchText"
              class="form-control"
              placeholder="Search by name or email..."
            />
            <button class="btn btn-primary">Find</button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <!-- User table -->
            <table class="user-table table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Class name</th>
                  <th>Teacher name</th>
                  <th>Code</th>
                  <th>Members</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(classroom, index) in filteredClassrooms"
                  :key="classroom.cid"
                  :class="{ 'table-active': index === selectedIndex }"
                  @click="selectedIndex = index"
                >
                  <td>{{ classroom.cid }}</td>
                  <td>{{ classroom.c_name }}</td>
                  <td>{{ classroom.teacher_name }}</td>
                  <td>{{ classroom.c_code }}</td>
                  <td>{{ classroom.member_count }}</td>
                  <td>{{ classroom.c_status ? 'Active' : 'Inactive' }}</td>
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

          <div v-if="selectedClassroom" class="col-md-4">
            <div class="card p-3">
              <div class="p-1">
                <strong>ID: </strong>
                {{ selectedClassroom.cid }}
              </div>
              <div class="p-1">
                <strong>Classroom name: </strong>
                {{ selectedClassroom.c_name }}
              </div>
              <div class="p-1">
                <strong>Teacher name: </strong>
                {{ selectedClassroom.teacher_name }}
              </div>
              <div class="p-1">
                <strong>Teacher ID: </strong>
                {{ selectedClassroom.uid }}
              </div>
              <div class="p-1">
                <strong>Members: </strong>
                {{ selectedClassroom.member_count }}
              </div>
              <div class="p-1">
                <strong>Status: </strong>
                {{ selectedClassroom.c_status ? 'Active' : 'Inactive' }}
              </div>
              <div class="p-1">
                <strong>Created at: </strong>
                {{ formatDate(selectedClassroom.c_created_at) }}
              </div>
              <div class="p-1">
                <strong>Updated at: </strong>
                {{ formatDate(selectedClassroom.c_updated_at) }}
              </div>
              <div class="p-1 text-end">
                <button
                  v-if="selectedClassroom.c_status"
                  @click="deactivateClassroom(selectedClassroom.cid)"
                  class="btn btn-danger"
                >
                  Deactivate
                </button>
                <button
                  v-else
                  @click="activateClassroom(selectedClassroom.cid)"
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
