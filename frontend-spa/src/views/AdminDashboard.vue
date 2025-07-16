<script setup>
// Không có logic, chỉ UI hiển thị
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Bảng điều khiển quản trị</h1>
        <p class="page-subtitle">Tổng quan hoạt động hệ thống lớp học</p>
      </div>
    </div>

    <div class="container">
      <!-- Tổng quan -->
      <div class="overview-grid">
        <div class="overview-card">
          <h3>👤 Người dùng</h3>
          <p class="count">124</p>
          <p class="desc">Tổng số tài khoản</p>
        </div>
        <div class="overview-card">
          <h3>Lớp học</h3>
          <p class="count">18</p>
          <p class="desc">Lớp đang hoạt động</p>
        </div>
        <div class="overview-card">
          <h3>Bài tập</h3>
          <p class="count">52</p>
          <p class="desc">Tổng số bài được giao</p>
        </div>
        <div class="overview-card">
          <h3>Bài nộp</h3>
          <p class="count">287</p>
          <p class="desc">Tổng số bài đã nộp</p>
        </div>
      </div>

      <!-- Placeholder cho biểu đồ (nếu cần sau này) -->
      <div class="content-section">
        <h3 class="section-title">Thống kê chi tiết (sẽ thêm sau)</h3>
        <p class="placeholder-text">Biểu đồ và dữ liệu nâng cao sẽ được hiển thị tại đây.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
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
  margin-bottom: 0.5rem;
}
.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

/* Tổng quan */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.overview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}
.overview-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}
.overview-card .count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
}
.overview-card .desc {
  color: #6c757d;
}

/* Section placeholder */
.content-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.section-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}
.placeholder-text {
  color: #6c757d;
}
</style>
