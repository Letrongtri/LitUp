<script setup>
// KHÔNG có logic hoặc gọi API
</script>


<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Lớp học đã tham gia</h1>
        <p class="page-subtitle">Danh sách lớp học và bài tập</p>
      </div>
    </div>

    <div class="container">
      <!-- Classrooms List -->
      <div class="content-section">
        <div class="section-header">
          <h3>Danh sách lớp học</h3>
          <div class="join-inline">
            <input
              type="text"
              class="form-control"
              placeholder="Nhập mã lớp..."
            />
            <button class="btn btn-success">Tham gia</button>
          </div>
        </div>

        <div class="classrooms-grid">
          <div class="classroom-card">
            <div class="card-header">
              <h4>Lớp Toán 12A1</h4>
            </div>
            <div class="card-body">
              <div class="card-actions">
                <button class="btn btn-primary">Xem bài tập</button>
              </div>
            </div>
          </div>

          <div class="classroom-card">
            <div class="card-header">
              <h4>Lớp Văn 12B2</h4>
            </div>
            <div class="card-body">
              <div class="card-actions">
                <button class="btn btn-primary">Xem bài tập</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment list -->
      <div class="content-section">
        <div class="section-header">
          <h3>Bài tập trong lớp Toán 12A1</h3>
        </div>

        <div class="assignments-section">
          <div class="assignments-list">
            <div class="assignment-item">
              <div class="assignment-info">
                <h5>Bài 1: Hàm số bậc nhất</h5>
                <span class="status-badge">Chưa nộp</span>
              </div>
              <div class="assignment-actions">
                <button class="btn btn-sm btn-outline">Xem</button>
                <button class="btn btn-sm btn-primary">Nộp bài</button>
              </div>
            </div>

            <div class="assignment-item">
              <div class="assignment-info">
                <h5>Bài 2: Ôn tập chương I</h5>
                <span class="status-badge">Đã nộp</span>
              </div>
              <div class="assignment-actions">
                <button class="btn btn-sm btn-outline">Xem</button>
                <button class="btn btn-sm btn-outline">Chỉnh sửa</button>
              </div>
            </div>
          </div>
        </div>
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
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.join-inline {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.join-inline input.form-control {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 200px;
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

.assignments-section h4 {
  margin-bottom: 1rem;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
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
.btn-success {
  background: #28a745;
  color: white;
}
.btn-outline {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>
