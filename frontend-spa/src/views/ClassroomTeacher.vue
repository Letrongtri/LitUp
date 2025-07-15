<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/litup_service';
import SubmissionManager from '@/components/SubmissionManager.vue';

const classrooms = ref([]);
const selectedClass = ref(null);
const assignments = ref([]);
const students = ref([]);
const selectedAssignment = ref(null);
const error = ref('');
const router = useRouter();

onMounted(async () => {
  try {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.u_role !== 'teacher') throw new Error('Bạn chưa đăng nhập hoặc không phải giáo viên');

    const uid = stored.uid;
    const rawClasses = await api.getTeacherClassrooms(uid);
    if (!Array.isArray(rawClasses)) throw new Error('API không trả về danh sách lớp học hợp lệ');

    classrooms.value = rawClasses.map(cls => ({
      ...cls,
      cid: cls.c_id ?? cls.cid,
    }));
  } catch (err) {
    error.value = err.message;
  }
});

async function viewClassroom(classroom) {
  const classId = Number(classroom?.cid);
  if (!classId || isNaN(classId)) {
    error.value = `Class ID không hợp lệ: ${classroom?.cid}`;
    return;
  }

  selectedClass.value = classroom;
  selectedAssignment.value = null;

  try {
    const result = await api.getAssignments(classId, 1, 10);
    assignments.value = result.assignments || [];
    students.value = await api.getStudentsInClass(classId, 1, 10);
  } catch (err) {
    error.value = err.message;
  }
}

function goToEditClass(cls) {
  router.push({ name: 'class.edit', params: { cid: cls.cid } });
}

function goToCreateAssignment(cid) {
  router.push({ name: 'assignment.create', params: { cid } });
}

function goToEditAssignment(aid) {
  router.push({ name: 'assignment.edit', params: { aid } });
}

function goToViewAssignment(aid) {
  router.push({ name: 'assignment.view', params: { aid } });
}

function viewAssignmentSubmissions(aid) {
  selectedAssignment.value = assignments.value.find(a => a.aid === aid);
}

async function onDeleteClass(cid) {
  if (!confirm('Bạn có chắc chắn muốn xoá lớp học này?')) return;
  try {
    await api.deleteClassroom(cid);
    classrooms.value = classrooms.value.filter(c => c.cid !== cid);
    if (selectedClass.value?.cid === cid) selectedClass.value = null;
  } catch (err) {
    error.value = 'Xoá lớp thất bại: ' + err.message;
  }
}

async function onDeleteAssignment(aid) {
  if (!confirm('Bạn có chắc chắn muốn xoá bài tập này?')) return;
  try {
    await api.deleteAssignment(aid);
    const result = await api.getAssignments(selectedClass.value.cid, 1, 10);
    assignments.value = result.assignments || [];
  } catch (err) {
    error.value = 'Xoá bài tập thất bại: ' + err.message;
  }
}
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Lớp học của bạn</h1>
        <p class="page-subtitle">Quản lý lớp học và bài tập</p>
      </div>
    </div>

    <div class="container">
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger mb-4">
        <strong>Lỗi:</strong> {{ error }}
      </div>

      <!-- Classrooms List -->
      <div class="content-section">
        <div class="section-header">
          <h3>Danh sách lớp học</h3>
        </div>
        
        <div class="classrooms-grid">
          <div v-for="cls in classrooms" :key="cls.cid" class="classroom-card">
            <div class="card-header">
              <h4>{{ cls.c_name }}</h4>
            </div>
            <div class="card-body">
              <div class="card-actions">
                <button class="btn btn-primary" @click="viewClassroom(cls)">
                  Xem chi tiết
                </button>
                <button class="btn btn-outline" @click="goToEditClass(cls)">
                  Chỉnh sửa
                </button>
                <button class="btn btn-danger" @click="onDeleteClass(cls.cid)">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Class Details -->
      <div v-if="selectedClass" class="content-section">
        <div class="section-header">
          <h3>{{ selectedClass.c_name }}</h3>
          <button class="btn btn-success" @click="goToCreateAssignment(selectedClass.cid)">
            + Tạo bài tập mới
          </button>
        </div>

        <div class="class-content">
          <!-- Assignments -->
          <div class="assignments-section">
            <h4>Bài tập ({{ assignments.length }})</h4>
            
            <div v-if="assignments.length" class="assignments-list">
              <div v-for="assignment in assignments" :key="assignment.aid" class="assignment-item">
                <div class="assignment-info">
                  <h5>{{ assignment.a_title }}</h5>
                  <span class="status-badge">Hoạt động</span>
                </div>
                <div class="assignment-actions">
                  <button class="btn btn-sm btn-outline" @click="goToViewAssignment(assignment.aid)">
                    Xem
                  </button>
                  <button class="btn btn-sm btn-outline" @click="viewAssignmentSubmissions(assignment.aid)">
                    Bài nộp
                  </button>
                  <button class="btn btn-sm btn-outline" @click="goToEditAssignment(assignment.aid)">
                    Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="onDeleteAssignment(assignment.aid)">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-message">
              <p>Chưa có bài tập nào. <a href="#" @click="goToCreateAssignment(selectedClass.cid)">Tạo bài tập đầu tiên</a></p>
            </div>
          </div>

          <!-- Students -->
          <div class="students-section">
            <h4>👥 Học sinh ({{ students.length }})</h4>
            
            <div v-if="students.length" class="students-list">
              <div v-for="student in students" :key="student.uid" class="student-item">
                <div class="student-avatar">{{ student.u_first_name.charAt(0) }}</div>
                <div class="student-info">
                  <strong>{{ student.u_first_name }} {{ student.u_last_name }}</strong>
                  <span class="student-email">{{ student.u_email }}</span>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-message">
              <p>Chưa có học sinh nào trong lớp.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Submission Manager -->
      <div v-if="selectedAssignment" class="content-section">
        <div class="section-header">
          <h3>📤 Bài nộp - {{ selectedAssignment.a_title }}</h3>
        </div>
        <SubmissionManager
          :assignment-id="selectedAssignment.aid"
          :assignment-title="selectedAssignment.a_title"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 1.1rem;
}

.content-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 2rem 0;
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.classroom-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.classroom-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.card-body {
  padding: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.class-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.assignments-section h4,
.students-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.assignments-list {
  space-y: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.assignment-info h5 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.status-badge {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.assignment-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.students-list {
  max-height: 400px;
  overflow-y: auto;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.student-item:last-child {
  border-bottom: none;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-email {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-message {
  text-align: center;
  color: #6c757d;
  padding: 2rem;
}

.empty-message a {
  color: #007bff;
  text-decoration: none;
}

.empty-message a:hover {
  text-decoration: underline;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-outline {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-outline:hover {
  background: #f8f9fa;
  color: #495057;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .class-content {
    grid-template-columns: 1fr;
  }

  .assignment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .assignment-actions {
    width: 100%;
    justify-content: space-between;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>