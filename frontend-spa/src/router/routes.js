import AuthPage from '@/views/AuthPage.vue';
import Dashboard from '@/views/Dashboard.vue';
import CreateClassroom from '@/views/CreateClassroom.vue';
import EditClassroom from '@/views/EditClassroom.vue';
import CreateAssigment from '@/views/CreateAssigment.vue';
import EditAssignment from '@/views/EditAssignment.vue';
import ViewAssignment from '@/views/ViewAssignment.vue';
import ClassroomTeacher from '@/views/ClassroomTeacher.vue';
import ClassroomStudent from '@/views/ClassroomStudent.vue';
import CreateSubmission from '@/views/CreateSubmission.vue';
import EditSubmission from '@/views/EditSubmission.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminClassManagement from '@/views/AdminClassManagement.vue';
import JoinedClassDetail from '@/views/JoinedClassDetail.vue';

import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ProfileUser from '@/views/ProfileUser.vue';
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';
const routes = [
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return '/auth';
      return user.u_role === 'teacher' ? '/teacher/classrooms' : '/student/classrooms';
    },
  },
  { path: '/auth', name: 'auth', component: AuthPage, meta: { layout: AuthLayout } },
  {
    path: '/student/classrooms',
    name: 'student.classrooms',
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
    path: '/403',
    name: 'forbidden',
    component: Forbidden,
    meta: { layout: DefaultLayout },
  },
  {
    path: '/:pathMatch(.*)*',  // bắt mọi route không khớp
    name: 'not-found',
    component: NotFound,
    meta: { layout: DefaultLayout },
  }

  //   { path: '/dashboard', name: 'dashboard', component: Dashboard },
  //   { path: '/classrooms/student', name: 'classrooms.student', component: ClassroomStudent },
  //   { path: '/classrooms/create', name: 'classrooms.create', component: CreateClassroom },
  //   { path: '/classrooms/:cid/edit', name: 'class.edit', component: EditClassroom },
  //   {
  //     path: '/classrooms/:cid/assigments/create',
  //     name: 'assignment.create',
  //     component: CreateAssigment,
  //   },
  //   { path: '/assignments/:aid/edit', name: 'assignment.edit', component: EditAssignment },
  //   { path: '/assignments/:aid', name: 'assignment.view', component: ViewAssignment },
  //   {
  //     path: '/assignments/:aid/submission',
  //     name: 'assignment.submission.view',
  //     component: CreateSubmission,
  //   },
  //   {
  //     path: '/assignments/:aid/submission/edit',
  //     name: 'assignment.submission.edit',
  //     component: EditSubmission,
  //   },
  //   { path: '/admin/dashboard', name: 'admin.dashboard', component: AdminDashboard },
  //   { path: '/admin/users', name: 'admin.users', component: AdminUserManagement },
  //   { path: '/admin/classes', name: 'admin.classes', component: AdminClassManagement },
];

export default routes;
