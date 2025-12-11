# LitUp – Web-Based Learning Management System

LitUp is a full-stack web application designed to support online teaching and learning. The system provides teachers, students, and administrators with a streamlined platform to manage classrooms, assignments, submissions, and system-wide analytics. Built with a modular architecture and RESTful APIs, LitUp ensures reliability, scalability, and ease of use.

## Overview
LitUp enables instructors to create classrooms, manage assignments, review submissions, and grade student work. Students can join classrooms, access learning materials, and submit assignments. Administrators have access to advanced tools for system monitoring, user management, and statistics.

## Key Features
### Authentication & Accounts
- User registration and login using secure APIs
- JWT-based authentication for protected routes
- Profile management (view, update, delete)
- Role-based access: Student, Teacher, Admin

### Teacher Features
- Classroom Management: Create, view, update, delete classrooms
- Assignment Management: Build assignments with deadlines, files, and point values
- Submission Management: View and grade student submissions with comments

### Student Features
- Join Classrooms: Enter class ID & code to join
- Assignment Access: View tasks, deadlines, and instructions
- Submission System: Upload, update, or delete submissions (before deadline)

### Admin Panel
- System Overview: Charts and metrics on users, classrooms, assignments, submissions
- User Management: Activate/deactivate accounts, update statuses
- Assignment Management: Review and update all assignments in the system
- Submission Monitoring: Access submissions across all classrooms

## Architecture
The platform follows a RESTful API structure with clear separation between backend and frontend:
- Backend: Node.js, Express, modular controllers, role-based routing
- Frontend: Vue.js with Pinia for state management and Vue-Query for async data control
- Database: Structured relational schema with entities for Users, Classrooms, Assignments, Submissions
- Authentication: JWT tokens with secure password hashing (bcrypt)
- Documentation: OpenAPI spec for API endpoints

## Frontend
- Framework: Vue.js
- State Management: Pinia, Vue-Query
- UI/UX: Responsive layout for teachers, students, and administrators
- Client-Side Features: Pagination, filters, file preview, modals, analytics charts

## Backend
- Node.js + Express REST APIs
- Authentication: JWT, bcrypt
- Database: Relational schema (Users, Classrooms, Assignments, Submissions)
- Error Handling: Centralized error middleware
- Seeder: Fake data generation for testing

## Admin Dashboard
- Built using Vue + chart.js
- Real-time overview of:
  - Total users
  - Classrooms
  - Assignments
  - Submissions

## Tech Stack
- Node.js, Express (Backend)
- Vue.js, Pinia, Vue-Query (Frontend)
- JWT, bcrypt (Auth)
- chart.js, vue-chartjs (Analytics)
- OpenAPI Specification
- File Upload Handling

## Deployment
The system runs on a standard Node.js server with a decoupled Vue frontend. Database setup is required before running the backend.

Contributors
- Lê Trọng Trí (B2206019) – Auth, Users, Assignments, Submissions
- Huỳnh Tiểu Băng (B2205973) – Classrooms, Admin, API Documentation


