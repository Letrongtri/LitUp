import router from '@/router';
import axios from 'axios';

const http = axios.create({
  baseURL: '/api',
  headers: {},
});

const noAuthRoutes = ['/auth/login', '/auth/register'];

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const needsAuth = !noAuthRoutes.some((route) => config.url.startsWith(route));

  if (token && needsAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Optional: bắt lỗi response
http.interceptors.response.use(
  (res) => res.data, // Trả về phần data thôi
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    // Nếu là 404 → chuyển sang trang 404
    if (status === 404) {
      router.replace('/404');
    }

    return Promise.reject(new Error(message));
  },
);

export default http;
