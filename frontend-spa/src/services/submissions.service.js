// import { efetch } from './service';

// function submissionsService() {
//   const baseUrlTeacher = '/api/teacher/submissions';
//   const baseUrlStudent = '/api/student/submissions';

//   async function getSubmissions(page, limit = 10) {
//     const user = JSON.parse(localStorage.getItem('user')).user;
//     let url = `${baseUrlStudent}?uid=${user.uid}&page=${page}&limit=${limit}`;

//     const data = await efetch(url);

//     return data;
//   }

//   async function getClassroomsByTeacher(page, limit = 10) {
//     const user = JSON.parse(localStorage.getItem('user')).user;

//     let url = `${baseUrlTeacher}?uid=${user.uid}&page=${page}&limit=${limit}`;
//     const data = await efetch(url);

//     return data;
//   }

//   async function getClassroom(id) {
//     const role = JSON.parse(localStorage.getItem('user')).user.u_role;

//     if (role === 'teacher') return await efetch(`${baseUrlTeacher}/${id}`);
//     else return await efetch(`${baseUrlStudent}/${id}`);
//   }

//   async function createClassroom(classroom) {
//     return efetch(baseUrlTeacher, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(classroom),
//     });
//   }

//   async function updateClassroom(id, classroom) {
//     console.log(classroom);

//     return efetch(`${baseUrlTeacher}/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(classroom),
//     });
//   }
//   async function deleteClassroom(id) {
//     return efetch(`${baseUrlTeacher}/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   async function getClassroomAssignment(cid) {
//     const role = JSON.parse(localStorage.getItem('user')).user.u_role;

//     if (role === 'teacher') return await efetch(`${baseUrlTeacher}/${cid}/assignments`);
//     else return await efetch(`${baseUrlStudent}/${cid}/assignments`);
//   }

//   async function getMembers(cid) {
//     return efetch(`${baseUrlTeacher}/${cid}/members`);
//   }

//   return {
//     getClassrooms,
//     getClassroom,
//     createClassroom,
//     updateClassroom,
//     deleteClassroom,
//     getClassroomAssignment,
//     getClassroomsByTeacher,
//     getMembers,
//   };
// }

// export default classroomsService();
