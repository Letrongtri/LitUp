import { efetch } from './service';

function submissionsService() {
  const baseUrlTeacher = '/api/teacher/submissions';
  const baseUrlStudent = '/api/student/submissions';

  async function getSubmissions(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;
    let url = `${baseUrlStudent}?uid=${user.uid}&page=${page}&limit=${limit}`;

    const data = await efetch(url);

    return data;
  }

  async function getSubmissionByTeacher(sid) {
    return await efetch(`${baseUrlTeacher}/${sid}`);
  }

  async function getSubmissionByStudent(uid, aid) {
    return await efetch(`${baseUrlStudent}?uid=${uid}&aid=${aid}`);
  }

  async function updateSubmission(formData) {
    return efetch(baseUrlStudent, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });
  }

  async function deleteSubmission(sid) {
    return efetch(`${baseUrlStudent}/${sid}`, {
      method: 'DELETE',
    });
  }

  return {
    getSubmissionByTeacher,
    getSubmissionByStudent,
    updateSubmission,
    deleteSubmission,
  };
}

export default submissionsService();
