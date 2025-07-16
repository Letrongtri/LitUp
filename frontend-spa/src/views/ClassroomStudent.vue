<script setup>
// KHÔNG có logic hoặc gọi API
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Lớp học đã tham gia</h1>
        <p class="page-subtitle">Tìm kiếm và xem chi tiết lớp học</p>
      </div>
    </div>

    <div class="container">
      <!-- Thanh tìm kiếm -->
      <div class="content-section">
        <div class="section-header">
          <h3>Danh sách lớp học</h3>
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm theo tên hoặc mã lớp..."
          />
        </div>

        <!-- Danh sách lớp học -->
        <div class="classrooms-grid">
          <div class="classroom-card">
            <div class="card-header">
              <h4>Lớp Toán 12A1</h4>
              <small class="text-muted">Mã lớp: ABC123</small>
            </div>
            <div class="card-body">
              <div class="card-actions">
                <button class="btn btn-primary">Xem lớp</button>
              </div>
            </div>
          </div>

          <div class="classroom-card">
            <div class="card-header">
              <h4>Lớp Văn 12B2</h4>
              <small class="text-muted">Mã lớp: XYZ789</small>
            </div>
            <div class="card-body">
              <div class="card-actions">
                <button class="btn btn-primary">Xem lớp</button>
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

.search-input {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 250px;
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
  padding: 1.2rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-header h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.card-body {
  padding: 1.2rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
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
</style>
