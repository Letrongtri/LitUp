<script setup>
import ClassroomStudentList from '@/components/ClassroomStudentList.vue';
import '../assets/css/ClassroomStudent.css';
import { computed, ref, watch } from 'vue';
import classroomsService from '@/services/classrooms.service';
import { useRoute, useRouter } from 'vue-router';
import MainPagination from '@/components/MainPagination.vue';

const route = useRoute();
const router = useRouter();

const totalPages = ref(1);

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const classrooms = ref([]);
const searchClass = ref('');

const searchableClassrooms = computed(() =>
  classrooms.value.map((classroom) => classroom.c_name.toLowerCase()),
);

// Classroom filtered by searchClass
const filteredClassrooms = computed(() => {
  if (!searchClass.value) return classrooms.value;
  return classrooms.value.filter((contact, index) =>
    searchableClassrooms.value[index].includes(searchClass.value),
  );
});

async function retrieveClassrooms(page) {
  try {
    const data = await classroomsService.getClassrooms(page);

    totalPages.value = data.metadata.lastPage ?? 1;
    classrooms.value = data.classrooms;
  } catch (error) {
    console.log(error);
  }
}

function changeCurrentPage(page) {
  router.push({ name: 'student.classrooms', query: { page } });
}

watch(currentPage, () => retrieveClassrooms(currentPage.value), { immediate: true });
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Lớp học đã tham gia</h1>
        <p class="page-subtitle">Tìm kiếm và xem chi tiết lớp học</p>
      </div>
    </div>

    <div class="container">
      <!-- Thanh tìm kiếm -->
      <div class="content-section">
        <div class="section-header d-flex justify-content-between">
          <h3>Danh sách lớp học</h3>
          <div class="join-inline">
            <input type="text" class="form-control" placeholder="Nhập mã lớp..." />
            <button class="btn btn-success">Tham gia</button>
          </div>
        </div>

        <ClassroomStudentList
          v-if="filteredClassrooms.length > 0"
          :classrooms="filteredClassrooms"
        />

        <h4 v-else>Bạn chưa tham gia lớp nào</h4>

        <div class="mt-5 d-flex flex-wrap justify-content-center align-items-center">
          <MainPagination
            :total-pages="totalPages"
            :current-page="currentPage"
            @update:current-page="changeCurrentPage"
          />
          <div class="w-100"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
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
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 1.1rem;
}

.content-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.join-inline {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.join-inline input.form-control {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 200px;
}

.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.classroom-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.classroom-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.card-body {
  padding: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.assignments-section h4 {
  margin-bottom: 1rem;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.assignment-info h5 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.status-badge {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #007bff;
  color: white;
}
.btn-success {
  background: #28a745;
  color: white;
}
.btn-outline {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>
