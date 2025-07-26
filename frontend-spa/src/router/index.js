import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.token;

  if (isLoggedIn && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (err) {
      authStore.logout();
      return next({ path: '/auth', query: { redirect: to.fullPath } });
    }
  }

  // Check login request
  if (!isLoggedIn && !to.path.startsWith('/auth')) {
    return next({ path: '/auth', query: { redirect: to.fullPath } });
  }

  // Check correct role
  if (to.meta.role && authStore.user?.u_role !== to.meta.role) {
    return next('/403'); // or redirect by role
  }

  return next();
});

export default router;
