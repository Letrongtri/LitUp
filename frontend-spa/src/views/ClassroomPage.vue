<script setup>
import ClassroomList from '@/components/ClassroomList.vue'
// import ClassroomCard from '@/components/ClassroomCard.vue'
import MainPagination from '@/components/MainPagination.vue'
import classroomsService from '@/services/classrooms.service'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const totalPages = ref(1)

// currentPage gets its value from the query string (?page=1)
const currentPage = computed(() => {
  const page = Number(route.query?.page)
  if (Number.isNaN(page) || page < 1) return 1
  return page
})

const classrooms = ref([])
const selectedIndex = ref(-1)
const searchText = ref('')

// Map each classroom to a string for searching
const searchableClassrooms = computed(() => classrooms.value)

const filteredClassrooms = computed(() => {
  if (!searchText.value) return classrooms.value
  return classrooms.value.filter((classroom, index) =>
    searchableClassrooms.value[index].includes(searchText.value),
  )
})

// Get classrooms for a specific pages
async function retrieveClassrooms(page) {
  try {
    const chunk = await classroomsService.getClassrooms(page)
    console.log(chunk.metadata)

    totalPages.value = chunk.metadata.lastPage ?? 1
    classrooms.value = chunk.classrooms // thêm phần sort by ngày tham gia
    selectedIndex.value = -1
  } catch (error) {
    console.log(error)
  }
}

function changeCurrentPage(page) {
  router.push({ name: 'classroomPage', query: { page } })
}

watch(currentPage, () => retrieveClassrooms(currentPage.value), { immediate: true })
</script>

<template>
  <h2>Classrooms</h2>

  <ClassroomList
    v-if="filteredClassrooms.length > 0"
    :classrooms="filteredClassrooms"
    v-model:selected-index="selectedIndex"
  />

  <p v-else>Bạn chưa tham gia lớp nào. (thêm btn join)</p>

  <div class="mt-3 d-flex flex-warp justify-content-round align-items-center">
    <MainPagination
      :total-pages="totalPages"
      :current-pages="currentPage"
      @update:current-page="changeCurrentPage"
    />

    <div class="w-100"></div>
  </div>
</template>
