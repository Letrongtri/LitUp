import { useAuthStore } from '@/stores/auth';
import http from './http';

function assignmentsService() {
  const baseUrlTeacher = '/teacher/assignments';
  const baseUrlStudent = '/student/assignments';

  async function getAssignments(page, limit = 10) {
    let url = `${baseUrlStudent}?page=${page}&limit=${limit}`;
    const res = await http.get(url);

    return res.data;
  }

  async function getAssignment(id) {
    const authStore = useAuthStore();
    let res = null;
    if (authStore.user.u_role === 'teacher') {
      res = await http.get(`${baseUrlTeacher}/${id}`);
    } else {
      res = await http.get(`${baseUrlStudent}/${id}`);
    }
    return res.data;
  }

  async function updateAssignment(id, formData) {
    return await http.put(`${baseUrlTeacher}/${id}`, formData);
  }

  async function deleteAssignment(id) {
    return await http.delete(`${baseUrlTeacher}/${id}`);
  }

  async function getSubmissions(id, page, limit = 10) {
    const res = await http.get(`${baseUrlTeacher}/${id}/submissions?limit=${limit}&page=${page}`);
    return res.data;
  }

  async function submitAssignment(aid, formData) {
    return await http.post(`${baseUrlStudent}/${aid}/submission`, formData);
  }

  async function getAssignmentSubmissionByStudent(aid) {
    return (await http.get(`${baseUrlStudent}/${aid}/submission`)).data;
  }

  async function updateSubmission(aid, formData) {
    return await http.put(`${baseUrlStudent}/${aid}/submission`, formData);
  }

  return {
    getAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissions,
    submitAssignment,
    getAssignmentSubmissionByStudent,
    updateSubmission,
  };
}

export default assignmentsService();
