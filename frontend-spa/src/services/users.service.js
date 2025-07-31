import http from './http';

function usersService() {
  const baseUrl = '/users';

  async function fetchMe() {
    return await http.get(baseUrl);
  }

  async function updateUser(data) {
    return await http.put(baseUrl, data); // có thể là JSON hoặc FormData
  }

  async function deleteUser() {
    return await http.delete(baseUrl);
  }

  return {
    fetchMe,
    updateUser,
    deleteUser,
  };
}

export default usersService();
