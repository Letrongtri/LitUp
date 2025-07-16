import { efetch } from './service';

function authService() {
  const baseUrl = '/api/auth';

  async function login(loginForm) {
    let url = `${baseUrl}/login`;

    return efetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginForm),
    });
  }

  async function register(registerForm) {
    let url = `${baseUrl}/register`;

    return efetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerForm),
    });
  }

  return {
    login,
    register,
  };
}

export default authService();
