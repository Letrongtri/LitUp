import { efetch } from './service';

function classroomsService() {
  const baseUrlTeacher = '/api/teacher/classrooms';
  const baseUrlStudent = '/api/student/classrooms';

  async function getClassrooms(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;
    let url = `${baseUrlStudent}?uid=${user.uid}&page=${page}&limit=${limit}`;

    const data = await efetch(url);

    return data;
  }

  async function getClassroomsByTeacher(page, limit = 10) {
    const user = JSON.parse(localStorage.getItem('user')).user;

    let url = `${baseUrlTeacher}?uid=${user.uid}&page=${page}&limit=${limit}`;
    const data = await efetch(url);

    return data;
  }

  async function getClassroom(id) {
    const role = JSON.parse(localStorage.getItem('user')).user.u_role;

    if (role === 'teacher') return await efetch(`${baseUrlTeacher}/${id}`);
    else return await efetch(`${baseUrlStudent}/${id}`);
  }

  async function createClassroom(classroom) {
    return efetch(baseUrlTeacher, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classroom),
    });
  }

  async function updateClassroom(id, classroom) {
    console.log(classroom);

    return efetch(`${baseUrlTeacher}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(classroom),
    });
  }

  async function deleteClassroom(id) {
    return efetch(`${baseUrlTeacher}/${id}`, {
      method: 'DELETE',
    });
  }

  async function getClassroomAssignment(cid) {
    const role = JSON.parse(localStorage.getItem('user')).user.u_role;

    if (role === 'teacher') return await efetch(`${baseUrlTeacher}/${cid}/assignments`);
    else return await efetch(`${baseUrlStudent}/${cid}/assignments`);
  }

  async function getMembers(cid) {
    return efetch(`${baseUrlTeacher}/${cid}/members`);
  }

  async function removeMember(cid, mid) {
    return efetch(`${baseUrlTeacher}/${cid}/members/${mid}`, {
      method: 'DELETE',
    });
  }

  async function createAssignment(cid, formData) {
    return efetch(`${baseUrlTeacher}/${cid}/assignments`, {
      method: 'POST',
      body: formData,
    });
  }

  async function joinClassroom(cid, joinData) {
    return efetch(`${baseUrlStudent}/${cid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(joinData),
    });
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
