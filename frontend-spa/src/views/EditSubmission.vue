<script setup>
// Không có logic, chỉ UI
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Chỉnh sửa bài đã nộp</h1>
        <p class="page-subtitle">Cập nhật lại nội dung hoặc file bài làm</p>
      </div>
    </div>

    <div class="container">
      <div class="content-section">
        <!-- Thông tin bài tập -->
        <div class="assignment-info">
          <h2>Bài 1: Hàm số bậc nhất</h2>
          <p class="assignment-desc">
            Bạn đã nộp bài vào ngày 15/07/2025 lúc 14:00.<br />
            Bạn có thể cập nhật nội dung cho đến hạn cuối 20/07/2025.
          </p>
        </div>

        <!-- Form chỉnh sửa bài nộp -->
        <div class="submission-form">
          <label for="submission-text">Nội dung đã nộp:</label>
          <textarea
            id="submission-text"
            class="form-control"
            rows="5"
            placeholder="Nhập lại nội dung bài làm..."
          >Giải phương trình y = ax + b và vẽ đồ thị minh họa...</textarea>

          <label for="submission-file" class="file-label">Đổi hoặc đính kèm file mới:</label>
          <input type="file" id="submission-file" class="file-input" />

          <button class="btn btn-primary submit-btn">Cập nhật bài nộp</button>
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
  max-width: 800px;
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

.assignment-info h2 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
.assignment-desc {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.submission-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.submission-form label {
  font-weight: 500;
  color: #2c3e50;
}
.submission-form .form-control {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
.file-input {
  padding: 0.5rem 0;
}
.submit-btn {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
}
.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #0056b3;
}
</style>
