import { efetch } from './service';

function usersService() {
  const baseUrl = '/api/users';

  async function getUserById(id) {
    let url = `${baseUrl}/${id}`;
    const data = await efetch(url);

    return data;
  }

  async function updateUser(id, formData) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async function deleteUser(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    getUserById,
    updateUser,
    deleteUser,
  };
}

export default usersService();
