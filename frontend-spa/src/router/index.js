import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Check login request
  if (!user && !to.path.startsWith('/auth')) {
    return next('/auth');
  }

 // Check correct role
  if (to.meta.role && user?.user.u_role !== to.meta.role) {
    return next('/403'); // or redirect by role
  }

  return next();
});

export default router;
