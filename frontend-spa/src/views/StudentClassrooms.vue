<script setup>
import ClassroomStudentList from '@/components/ClassroomStudentList.vue';
import '../assets/css/ClassroomStudent.css';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainPagination from '@/components/MainPagination.vue';
import JoinClassroom from '@/components/JoinClassroom.vue';
import { useClassroomsByStudent } from '@/composables/useClassroom';

const route = useRoute();
const router = useRouter();

const showModal = ref(false);

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});

const { data, isLoading, refetch } = useClassroomsByStudent(currentPage.value);
const classrooms = computed(() => data.value?.classrooms || []);
const totalPages = computed(() => data.value?.metadata.lastPage || 1);

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
</script>

<template>
  <div v-if="isLoading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="page-container">
    <!-- Header -->
    <div class="container">
      <div class="content-section">
        <div class="row">
          <div class="col-lg-9 col-sm-12">
            <h2 class="fw-bold text-primary mb-2">Classes attended</h2>
            <p class="page-subtitle mb-0">Search and view class details</p>
          </div>
          <div
            class="col-lg-3 col-sm-12 d-flex justify-content-end align-items-center mt-3 mt-lg-0"
          >
            <button class="btn btn-primary" @click="showModal = true">
              <i class="fa fa-plus me-2" aria-hidden="true"></i>
              Join Classroom
            </button>
          </div>
        </div>
      </div>
    </div>

    <JoinClassroom v-if="showModal" @created="refetch" @close="showModal = false" />

    <div class="container">
      <!-- Search bar -->
      <div class="content-section">
        <div class="section-header d-flex justify-content-between">
          <h3>List of classes</h3>
          <div class="input-group w-auto">
            <input
              type="text"
              class="form-control px-3"
              placeholder="Find class"
              v-model="searchClass"
            />
            <button class="btn btn-success">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <ClassroomStudentList
          v-if="filteredClassrooms.length > 0"
          :classrooms="filteredClassrooms"
          class="custom-classroom-list"
        />

        <h4 v-else>You have not attended any classes yet.</h4>

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