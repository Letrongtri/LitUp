import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '@/views/AuthPage.vue';
import Dashboard from '@/views/Dashboard.vue';
import Profile from '@/views/Profile.vue';
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

const routes = [
    { path: '/',
        redirect: () => {
            const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return '/auth'; 
            return user.u_role === 'teacher'
            ? '/classrooms'
            : '/student/classrooms';
        }
    },
    {
        path: '/student/classrooms',
        name: 'student.classrooms',
        component: ClassroomStudent
    },                         
    { path: '/auth', name: 'auth', component: AuthPage },     
    { path: '/dashboard', name: 'dashboard', component: Dashboard }, 
    { path: '/profile', name: 'profile', component: Profile },       
    { path: '/classrooms', name: 'classrooms', component: ClassroomTeacher}, 
    { path: '/classrooms/create', name: 'classrooms.create', component: CreateClassroom },
    { path: '/classrooms/:cid/edit', name: 'class.edit', component: EditClassroom},
    { path: '/classrooms/:cid/assigments/create', name: 'assignment.create', component: CreateAssigment},
    { path: '/assignments/:aid/edit', name: 'assignment.edit', component: EditAssignment },
    { path: '/assignments/:aid', name: 'assignment.view', component: ViewAssignment },
    { path: '/assignments/:aid/submission', name:'assignment.submission.view', component: CreateSubmission},
    { path: '/assignments/:aid/submission/edit', name: 'assignment.submission.edit', component: EditSubmission},
    { path: '/admin/dashboard', name: 'admin.dashboard', component: AdminDashboard},
    { path: '/admin/users', name: 'admin.users', component: AdminUserManagement},
    { path: '/admin/classes', name: 'admin.classes', component: AdminClassManagement},


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;