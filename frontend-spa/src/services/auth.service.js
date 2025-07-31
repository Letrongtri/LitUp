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

  return {
    login,
    register,
  };
}

export default authService();
