import http from './http';

function adminService() {
  const baseUrl = '/admin';

  async function getStatistics() {
    return (await http.get(`${baseUrl}/overview`)).data;
  }

  async function getUsersByAdmin(page, limit = 10) {
    let url = `${baseUrl}/users?page=${page}&limit=${limit}`;
    return (await http.get(url)).data;
  }

  async function editAccount(id, data) {
    return http.put(`${baseUrl}/users/${id}`, data).da;
  }

  async function getClassroomsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/classrooms?page=${page}&limit=${limit}`;
    return (await http.get(url)).data;
  }

  async function editClassroom(id, data) {
    return http.put(`${baseUrl}/classrooms/${id}`, data);
  }

  async function getAssignmentsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/assignments?page=${page}&limit=${limit}`;
    return (await http.get(url)).data;
  }

  async function editAssignment(id, data) {
    return http.put(`${baseUrl}/assignments/${id}`, data);
  }

  async function getSubmissionsByAdmin(page, limit = 10) {
    let url = `${baseUrl}/submissions?page=${page}&limit=${limit}`;
    return (await http.get(url)).data;
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
