// Common views
import AuthPage from '@/views/AuthPage.vue';
import ProfileUser from '@/views/ProfileUser.vue';
import Homepage from '@/views/Homepage.vue';

// Layout
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Teacher views
import TeacherClassrooms from '@/views/TeacherClassrooms.vue';
import TeacherDetailClassroom from '@/views/TeacherDetailClassroom.vue';
import TeacherDetailAssignment from '@/views/TeacherDetailAssignment.vue';
import TeacherDetailSubmission from '@/views/TeacherDetailSubmission.vue';

// Student views
import StudentClassrooms from '@/views/StudentClassrooms.vue';
import StudentDetailClassroom from '@/views/StudentDetailClassroom.vue';
import StudentDetailAssignment from '@/views/StudentDetailAssignment.vue';

// Admin views
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminClassManagement from '@/views/AdminClassManagement.vue';
import AdminUserManagement from '@/views/AdminUserManagement.vue';
import AdminAssignmentManagement from '@/views/AdminAssignmentManagement.vue';
import AdminSubmissionManagement from '@/views/AdminSubmissionManagement.vue';

// Error page
import NotFound from '@/views/NotFound.vue';
import Forbidden from '@/views/Forbidden.vue';

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Homepage,
    meta: { layout: AuthLayout },
  },
  { path: '/auth', name: 'auth', component: AuthPage, meta: { layout: AuthLayout } },
  {
    path: '/users',
    name: 'profile',
    component: ProfileUser,
    meta: { layout: DefaultLayout },
  },
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
  {
    path: '/teacher/submissions/:sid',
    name: 'teacher.submission.detail',
    component: TeacherDetailSubmission,
    meta: { layout: DefaultLayout, role: 'teacher' },
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: AdminDashboard,
    meta: { layout: AdminLayout, role: 'admin' },
  },
  {
    path: '/admin/classrooms',
    name: 'admin.classrooms',
    component: AdminClassManagement,
    meta: { layout: AdminLayout, role: 'admin' },
  },
  {
    path: '/admin/users',
    name: 'admin.users',
    component: AdminUserManagement,
    meta: { layout: AdminLayout, role: 'admin' },
  },
  {
    path: '/admin/assignments',
    name: 'admin.assignments',
    component: AdminAssignmentManagement,
    meta: { layout: AdminLayout, role: 'admin' },
  },
  {
    path: '/admin/submissions',
    name: 'admin.submissions',
    component: AdminSubmissionManagement,
    meta: { layout: AdminLayout, role: 'admin' },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: Forbidden,
    meta: { layout: DefaultLayout },
  },
  {
    path: '/:pathMatch(.*)*', // catch any mismatched routes
    name: 'not-found',
    component: NotFound,
    meta: { layout: DefaultLayout },
  },
];

export default routes;
