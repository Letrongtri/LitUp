import http from './http';

function submissionsService() {
  const baseUrlTeacher = '/teacher/submissions';
  const baseUrlStudent = '/student/submissions';

  async function getSubmissionByTeacher(sid) {
    return (await http.get(`${baseUrlTeacher}/${sid}`)).data;
  }

  async function deleteSubmission(sid) {
    return http.delete(`${baseUrlStudent}/${sid}`);
  }

  async function gradeSubmission(sid, data) {
    return http.put(`${baseUrlTeacher}/${sid}`, data);
  }

  return {
    getSubmissionByTeacher,
    deleteSubmission,
    gradeSubmission,
  };
}

export default submissionsService();
