import { efetch } from './service';

function classroomsService() {
  const baseUrl = '/api/classrooms';

  async function getClassrooms(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;

    let url = `${baseUrl}?uid=${user.uid}&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getClassroomsByTeacher(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;

    let url = `${baseUrl}/teacher/?uid=${user.uid}&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getClassroom(id) {
    return await efetch(`${baseUrl}/${id}`);
  }

  async function createClassroom(classroom) {
    return efetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classroom),
    });
  }

  async function updateClassroom(id, classroom) {
    console.log(classroom);

    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classroom),
    });
  }
  async function deleteClassroom(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  async function getClassroomAssignment(cid) {
    let url = `${baseUrl}/${cid}/assignments`;
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
    getClassroomsByTeacher,
  };
}

export default classroomsService();
