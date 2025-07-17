import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Kiểm tra yêu cầu đăng nhập
  if (!user && !to.path.startsWith('/auth')) {
    return next('/auth');
  }

  // Kiểm tra đúng role
  // if (to.meta.role && user?.u_role !== to.meta.role) {
  //   return next('/auth'); // hoặc redirect theo role
  // }

  return next();
});

export default router;
