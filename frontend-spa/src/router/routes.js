// Layout
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthPage from '@/views/AuthPage.vue';

// Views
import TeacherClassrooms from '@/views/TeacherClassrooms.vue';
import StudentClassrooms from '@/views/StudentClassrooms.vue';
import TeacherDetailClassroom from '@/views/TeacherDetailClassroom.vue';
import TeacherDetailAssignment from '@/views/TeacherDetailAssignment.vue';
import StudentDetailClassroom from '@/views/StudentDetailClassroom.vue';
import StudentDetailAssignment from '@/views/StudentDetailAssignment.vue';

import ProfileUser from '@/views/ProfileUser.vue';

import Dashboard from '@/views/Dashboard.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminClassManagement from '@/views/AdminClassManagement.vue';
import JoinedClassDetail from '@/views/JoinedClassDetail.vue';

// Error page
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';

const routes = [
  {
    path: '/',
    redirect: () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')).user;
        return user.u_role === 'teacher' ? '/teacher/classrooms' : '/student/classrooms';
      } catch (e) {
        return '/auth';
      }
    },
  },
  { path: '/auth', name: 'auth', component: AuthPage, meta: { layout: AuthLayout } },
  {
    path: '/student/classrooms',
    name: 'student.classrooms',
    component: StudentClassrooms,
    meta: { layout: DefaultLayout, role: 'student' },
  },
  {
    path: '/teacher/classrooms',
    name: 'teacher.classrooms',
    component: TeacherClassrooms,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/users/:uid',
    name: 'profile',
    component: ProfileUser,
    meta: { layout: DefaultLayout },
  },
  {
    path: '/student/classrooms/:cid/',
    name: 'student.class.detail',
    component: StudentDetailClassroom,
    meta: { layout: DefaultLayout, role: 'student' },
  },
  {
    path: '/teacher/classrooms/:cid/',
    name: 'teacher.class.detail',
    component: TeacherDetailClassroom,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/teacher/assignments/:aid',
    name: 'teacher.assignment.detail',
    component: TeacherDetailAssignment,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/student/assignments/:aid',
    name: 'student.assignment.detail',
    component: StudentDetailAssignment,
    meta: { layout: DefaultLayout, role: 'student' },
  },
  //   { path: '/dashboard', name: 'dashboard', component: Dashboard },
  //   { path: '/classrooms/student', name: 'classrooms.student', component: ClassroomStudent },
  //     path: '/assignments/:aid/submission',
  //   { path: '/admin/dashboard', name: 'admin.dashboard', component: AdminDashboard },
  //   { path: '/admin/users', name: 'admin.users', component: AdminUserManagement },
  //   { path: '/admin/classes', name: 'admin.classes', component: AdminClassManagement },
  {
    path: '/403',
    name: 'forbidden',
    component: Forbidden,
    meta: { layout: DefaultLayout },
  },
  {
    path: '/:pathMatch(.*)*', // bắt mọi route không khớp
    name: 'not-found',
    component: NotFound,
    meta: { layout: DefaultLayout },
  },
];

export default routes;
