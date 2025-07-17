import { efetch } from './service';

function assignmentsService() {
  const baseUrl = '/api/assignments';

  async function getAssignments(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user'));

    let url = `${baseUrl}?uid=${user.user.uid}&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getAssignment(id) {
    return await efetch(`${baseUrl}/${id}`);
  }

  async function createAssignment(Assignment) {
    return efetch(baseUrl, {
      method: 'POST',
      body: Assignment,
    });
  }

  async function updateAssignment(id, Assignment) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: Assignment,
    });
  }
  async function deleteAssignment(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}

export default assignmentsService();
