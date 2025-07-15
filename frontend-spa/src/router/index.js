import { createWebHistory, createRouter } from 'vue-router'
import Classroom from '@/views/ClassroomPage.vue'

const routes = [
  {
    path: '/',
    name: 'classroom',
    component: Classroom,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
