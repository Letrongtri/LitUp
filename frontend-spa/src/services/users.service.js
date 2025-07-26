import http from './http';

function usersService() {
  const baseUrl = '/users';

  async function getUserById(id) {
    return await http.get(`${baseUrl}/${id}`);
  }

  async function updateUser(data) {
    return await http.put(`/users`, data); // có thể là JSON hoặc FormData
  }

  async function deleteUser(id) {
    return await http.delete(`/users`);
  }

  return {
    getUserById,
    updateUser,
    deleteUser,
  };
}

export default usersService();
