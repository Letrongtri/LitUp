import { efetch } from './service';

function assignmentsService() {
  const baseUrlTeacher = '/api/teacher/assignments';
  const baseUrlStudent = '/api/student/assignments';

  async function getAssignments(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user'));

    let url = `${baseUrlStudent}?uid=${user.user.uid}&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getAssignment(id) {
    const role = JSON.parse(localStorage.getItem('user')).user.u_role;

    if (role === 'teacher') return await efetch(`${baseUrlTeacher}/${id}`);
    else return await efetch(`${baseUrlStudent}/${id}`);
  }

  async function updateAssignment(id, formData) {
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }

    return efetch(`${baseUrlTeacher}/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async function deleteAssignment(id) {
    return efetch(`${baseUrlTeacher}/${id}`, {
      method: 'DELETE',
    });
  }

  async function getSubmissions(id, page, limit = 10) {
    return efetch(`${baseUrlTeacher}/${id}/submissions?limit=${limit}&page=${page}`);
  }

  return {
    getAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissions,
  };
}

export default assignmentsService();
