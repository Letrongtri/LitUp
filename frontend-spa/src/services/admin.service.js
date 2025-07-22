import { efetch } from './service';

function adminService() {
  const baseUrl = '/api/admin';

  async function getStatistics() {
    return await efetch(`${baseUrl}/overview`);
  }

  async function getUsersByAdmin(page, limit = 10) {
    let url = `${baseUrl}/users?page=${page}&limit=${limit}`;
    return await efetch(url);
  }

  async function editAccount(id, data) {
    return efetch(`${baseUrl}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async function getClassroomsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/classrooms?page=${page}&limit=${limit}`;
    return await efetch(url);
  }

  async function editClassroom(id, data) {
    return efetch(`${baseUrl}/classrooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async function getAssignmentsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/assignments?page=${page}&limit=${limit}`;
    return await efetch(url);
  }

  async function editAssignment(id, data) {
    return efetch(`${baseUrl}/assignments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async function getSubmissionsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/submissions?page=${page}&limit=${limit}`;
    return await efetch(url);
  }

  return {
    getStatistics,
    getUsersByAdmin,
    editAccount,
    getClassroomsByAdmin,
    editClassroom,
    getAssignmentsByAdmin,
    editAssignment,
    getSubmissionsByAdmin,
  };
}

export default adminService();
