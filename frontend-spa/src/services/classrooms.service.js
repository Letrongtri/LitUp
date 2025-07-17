import { efetch } from './service';

function classroomsService() {
  const baseUrl = '/api/classrooms';

  async function getClassrooms(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;

    let url = `${baseUrl}?uid=${user.uid}&page=${page}&limit=${limit}`;
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

  async function getClassroomAssignment(cid, page, limit = 10) {
    let url = `${baseUrl}/${cid}/assignments?page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  return {
    getClassrooms,
    getClassroom,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getClassroomAssignment,
  };
}

export default classroomsService();
