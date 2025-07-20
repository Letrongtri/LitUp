import AuthPage from '@/views/AuthPage.vue';
import Dashboard from '@/views/Dashboard.vue';
import ViewAssignment from '@/views/ViewAssignment.vue';
import ClassroomTeacher from '@/views/ClassroomTeacher.vue';
import ClassroomStudent from '@/views/ClassroomStudent.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminClassManagement from '@/views/AdminClassManagement.vue';
import JoinedClassDetail from '@/views/JoinedClassDetail.vue';
import TeacherDetailClassroom from '@/views/TeacherDetailClassroom.vue';

import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ProfileUser from '@/views/ProfileUser.vue';
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
import TeacherDetailAssignment from '@/views/TeacherDetailAssignment.vue';
const routes = [
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user')).user;
      if (!user) return '/auth';
      return user.u_role === 'teacher' ? '/teacher/classrooms' : '/student/classrooms';
    },
  },
  { path: '/auth', name: 'auth', component: AuthPage, meta: { layout: AuthLayout } },
  {
    path: '/student/classrooms',
    name: 'classrooms.student',
    component: ClassroomStudent,
    meta: { layout: DefaultLayout, role: 'student' },
  },
  {
    path: '/teacher/classrooms',
    name: 'classrooms.teacher',
    component: ClassroomTeacher,
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
    name: 'class.joined.detail',
    component: JoinedClassDetail,
    meta: { layout: DefaultLayout, role: 'student' },
  },
  {
    path: '/teacher/classrooms/:cid/',
    name: 'class.detail.teacher',
    component: TeacherDetailClassroom,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/teacher/assignments/:aid',
    name: 'assignment.detail.teacher',
    component: TeacherDetailAssignment,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/student/assignments/:aid',
    name: 'assignment.detail.student',
    component: ViewAssignment,
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
