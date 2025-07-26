import http from './http';
// import { efetch } from './service';

function authService() {
  const baseUrl = '/auth';

  async function login(payload) {
    return await http.post(`${baseUrl}/login`, payload);
  }

  async function register(payload) {
    return await http.post(`${baseUrl}/register`, payload);
  }

  async function fetchMe() {
    return await http.get('/users/me');
  }

  return {
    login,
    register,
    fetchMe,
  };
}

export default authService();
