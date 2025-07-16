import { efetch } from './service';

function classroomsService() {
  const baseUrl = '/api/classrooms';

  async function getClassrooms(page, limit = 10) {
    let url = `${baseUrl}?uid=1&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getClassroom(id) {
    return await efetch(`${baseUrl}/${id}`);
  }

  async function createClassroom(classroom) {
    return efetch(baseUrl, {
      method: 'POST',
      body: classroom,
    });
  }

  async function updateClassroom(id, classroom) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: classroom,
    });
  }
  async function deleteClassroom(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    getClassrooms,
    getClassroom,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
}

export default classroomsService();
