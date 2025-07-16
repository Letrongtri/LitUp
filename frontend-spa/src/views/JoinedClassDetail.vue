<script setup>
// KHÔNG gọi API — chỉ UI
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <!-- Thông tin lớp -->
      <div class="class-box bg-white shadow-sm rounded-4 p-4 mb-5 border">
        <h2 class="mb-3 text-primary fw-bold">Lớp Toán 12A1</h2>
        <p class="mb-1"><strong>Giáo viên:</strong> Nguyễn Văn A</p>
        <p class="mb-0"><strong>Mã lớp:</strong> ABC123</p>
      </div>

      <!-- Danh sách bài tập -->
      <div class="assignment-section bg-white shadow-sm rounded-4 p-4 border">
        <h4 class="mb-4">Danh sách bài tập</h4>

        <div class="assignment-list d-flex flex-column gap-3">
          <div class="assignment-item border rounded-3 p-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1 fw-semibold text-dark">Bài 1: Hàm số bậc nhất</h6>
              <span class="badge bg-warning text-dark">Chưa nộp</span>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2">Xem</button>
              <button class="btn btn-sm btn-primary">Nộp bài</button>
            </div>
          </div>

          <div class="assignment-item border rounded-3 p-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1 fw-semibold text-dark">Bài 2: Ôn tập chương I</h6>
              <span class="badge bg-success">Đã nộp</span>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2">Xem</button>
              <button class="btn btn-sm btn-outline-primary">Chỉnh sửa</button>
            </div>
          </div>
        </div>

        <p class="text-muted text-center mt-4" v-if="false">Chưa có bài tập nào</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f6f9;
}

.class-box {
  background: #fff;
}

.assignment-section {
  background: #fff;
}

.assignment-item h6 {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.35em 0.7em;
  border-radius: 12px;
}
</style>
