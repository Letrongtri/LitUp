<script setup>
import ClassroomStudentList from '@/components/ClassroomStudentList.vue';
import '../assets/css/ClassroomStudent.css';
import { computed, ref, watch } from 'vue';
import classroomsService from '@/services/classrooms.service';
import { useRoute, useRouter } from 'vue-router';
import MainPagination from '@/components/MainPagination.vue';
import JoinClassroom from '@/components/JoinClassroom.vue';

const route = useRoute();
const router = useRouter();

const totalPages = ref(1);
const showModal = ref(false);

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
    <!-- Enhanced Header Banner -->
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <div class="row align-items-center">
          <div class="col-lg-9 col-sm-12">
            <h2 class="fw-bold text-primary mb-2">Classes attended</h2>
            <p class="page-subtitle mb-0">Search and view class details</p>
          </div>
          <div class="col-lg-3 col-sm-12 d-flex justify-content-end align-items-center mt-3 mt-lg-0">
            <button class="btn btn-primary" @click="showModal = true">
              <i class="fa fa-plus me-2" aria-hidden="true"></i>
              Join Classroom
            </button>
          </div>
        </div>
      </div>
    </div>

    <JoinClassroom v-if="showModal" @created="retrieveClassrooms(1)" @close="showModal = false" />

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
            <button class="btn btn-success" @click="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <ClassroomStudentList
          v-if="filteredClassrooms.length > 0"
          :classrooms="filteredClassrooms"
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

