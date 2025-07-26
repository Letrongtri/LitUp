<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainPagination from '@/components/MainPagination.vue';
import CreateClassroom from '@/components/CreateClassroom.vue';
import { formatDate } from '@/utils/format';
import { useClassroomsByTeacher } from '@/composables/useClassroom';

const router = useRouter();
const route = useRoute();

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const { data, isLoading, error, refetch } = useClassroomsByTeacher(currentPage.value);

const classrooms = computed(() => data.value?.classrooms || []);
const totalPages = computed(() => data.value?.metadata?.lastPage || 1);

const showModal = ref(false);

const searchClass = ref('');

// Classroom filtered by searchClass
const filteredClassrooms = computed(() => {
  if (!searchClass.value) return classrooms.value;

  return classrooms.value.filter((classroom) =>
    classroom.c_name.toLowerCase().includes(searchClass.value.toLowerCase()),
  );
});

function changeCurrentPage(page) {
  router.push({ name: 'student.classrooms', query: { page } });
}

function goToDetailClassroomPage(cls) {
  router.push({ name: 'teacher.class.detail', params: { cid: cls.cid } });
}
</script>

<template>
  <div class="page-container">
    <!-- Enhanced Header Banner -->
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <div class="row align-items-center">
          <div class="col-lg-9 col-sm-12">
            <h2 class="fw-bold text-primary mb-2">Your classroom</h2>
            <p class="page-subtitle mb-0">Classroom and assignment management</p>
          </div>
          <div class="col-lg-3 col-sm-12 d-flex justify-content-end align-items-center mt-3 mt-lg-0">
            <button class="btn btn-primary" @click="showModal = true">
              <i class="fa fa-plus me-2" aria-hidden="true"></i>
              Create Classroom
            </button>
          </div>
        </div>
      </div>
    </div>

    <CreateClassroom v-if="showModal" @created="refetch" @close="showModal = false" />

    <div class="container">
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger mb-4"><strong>Error:</strong> {{ error }}</div>

      <div v-if="isLoading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Classrooms List -->
      <div v-else class="content-section">
        <div class="section-header d-flex justify-content-between">
          <h3>List of classroom</h3>
          <div class="input-group w-auto">
            <input
              type="text"
              class="form-control px-3"
              placeholder="Find class"
              v-model="searchClass"
            />
            <button class="btn btn-success" @click="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div v-if="filteredClassrooms" class="classrooms-grid">
          <div v-for="cls in filteredClassrooms" :key="cls.cid" class="classroom-card">
            <div class="card-header">
              <h4 @click="goToDetailClassroomPage(cls)" style="cursor: pointer">
                {{ cls.c_name }}
              </h4>
            </div>
            <div class="card-body">
              <p>Students: {{ cls.student_count }}</p>
              <p>Created at: {{ formatDate(cls.c_created_at) }}</p>
            </div>
          </div>
        </div>
        <h4 v-else>You have not created a class yet</h4>

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
  background-color: #f5f6f9;
}

/* Enhanced Header Banner - similar to Tin11 style */
.class-header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.class-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-section {
  background: white;
  border-radius: 0.375rem;
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
  font-size: 1.5rem;
  font-weight: 600;
}

.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.classroom-card {
  border: 1px solid #e0e0e0;
  border-radius: 0.375rem;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.classroom-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f8f9fa;
  padding: 1.2rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.card-body {
  padding: 1.2rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.class-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.assignments-section h4,
.students-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.assignments-list {
  space-y: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
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
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.students-list {
  max-height: 400px;
  overflow-y: auto;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.student-item:last-child {
  border-bottom: none;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.375rem;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-email {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-message {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.empty-message a {
  color: #007bff;
  text-decoration: none;
}

.empty-message a:hover {
  text-decoration: underline;
}

h4 {
  font-size: 1.2rem;
  color: #888;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
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

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-outline {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-outline:hover {
  background: #f8f9fa;
  color: #495057;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

/* Input controls */
.form-control {
  border-radius: 0.375rem;
  font-size: 1rem;
}

.search-input {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  min-width: 250px;
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .class-header h2 {
    font-size: 1.8rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .class-content {
    grid-template-columns: 1fr;
  }

  .assignment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .assignment-actions {
    width: 100%;
    justify-content: space-between;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>
