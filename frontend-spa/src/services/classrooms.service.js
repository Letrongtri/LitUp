import { useAuthStore } from '@/stores/auth';
import http from './http';

function classroomsService() {
  const baseUrlTeacher = '/teacher/classrooms';
  const baseUrlStudent = '/student/classrooms';

  async function getClassrooms(page, limit = 10) {
    let url = `${baseUrlStudent}?page=${page}&limit=${limit}`;
    return (await http.get(url)).data;
  }

  async function getClassroomsByTeacher(page, limit = 10) {
    let url = `${baseUrlTeacher}?page=${page}&limit=${limit}`;
    const res = await http.get(url);
    return res.data;
  }

  async function getClassroom(id) {
    const authStore = useAuthStore();
    if (authStore.user.u_role === 'teacher') {
      const res = await http.get(`${baseUrlTeacher}/${id}`);
      return res.data;
    } else if (authStore.user.u_role === 'student') {
      const res = await http.get(`${baseUrlStudent}/${id}`);
      return res.data;
    }
  }

  async function createClassroom(classroom) {
    return http.post(baseUrlTeacher, classroom);
  }

  async function updateClassroom(id, classroom) {
    return http.put(`${baseUrlTeacher}/${id}`, classroom);
  }

  async function deleteClassroom(id) {
    return http.delete(`${baseUrlTeacher}/${id}`);
  }

  async function getClassroomAssignment(cid) {
    const authStore = useAuthStore();
    if (authStore.user.u_role === 'teacher')
      return (await http.get(`${baseUrlTeacher}/${cid}/assignments`)).data;
    else return (await http.get(`${baseUrlStudent}/${cid}/assignments`)).data;
  }

  async function getMembers(cid) {
    return (await http.get(`${baseUrlTeacher}/${cid}/members`)).data;
  }

  async function removeMember(cid, mid) {
    return http.delete(`${baseUrlTeacher}/${cid}/members/${mid}`);
  }

  async function createAssignment(cid, formData) {
    return http.post(`${baseUrlTeacher}/${cid}/assignments`, formData);
  }

  async function joinClassroom(cid, joinData) {
    return http.post(`${baseUrlStudent}/${cid}`, joinData);
  }

  return {
    getClassrooms,
    getClassroom,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getClassroomAssignment,
    getClassroomsByTeacher,
    getMembers,
    createAssignment,
    removeMember,
    joinClassroom,
  };
}

export default classroomsService();
