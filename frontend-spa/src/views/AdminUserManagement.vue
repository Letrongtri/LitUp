<script setup>
// Không có logic, chỉ UI
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Quản lý người dùng</h1>
        <p class="page-subtitle">Xem, sửa, hoặc xoá tài khoản trong hệ thống</p>
      </div>
    </div>

    <div class="container">
      <!-- Tìm kiếm -->
      <div class="content-section">
        <div class="section-header">
          <h3>Danh sách người dùng</h3>
          <div class="search-box">
            <input type="text" class="form-control" placeholder="Tìm theo tên hoặc email..." />
            <button class="btn btn-primary">Tìm</button>
          </div>
        </div>

        <!-- Bảng người dùng -->
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>U001</td>
              <td>Nguyễn Văn A</td>
              <td>a@example.com</td>
              <td>Học sinh</td>
              <td>
                <button class="btn btn-sm btn-outline">Xem</button>
                <button class="btn btn-sm btn-outline">Sửa</button>
                <button class="btn btn-sm btn-danger">Xoá</button>
              </td>
            </tr>
            <tr>
              <td>U002</td>
              <td>Trần Thị B</td>
              <td>b@example.com</td>
              <td>Giáo viên</td>
              <td>
                <button class="btn btn-sm btn-outline">Xem</button>
                <button class="btn btn-sm btn-outline">Sửa</button>
                <button class="btn btn-sm btn-danger">Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
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
}
.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.search-box {
  display: flex;
  gap: 0.5rem;
}
.search-box .form-control {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 250px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th,
.user-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.user-table th {
  background-color: #f8f9fa;
  color: #333;
}
.user-table td button {
  margin-right: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-outline {
  background: white;
  border: 1px solid #ccc;
  color: #333;
}
.btn-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
}
</style>
