<script setup>
// KHÔNG gọi API — chỉ UI
</script>
<template>
  <div class="page-container bg-light">
    <!-- Banner lớp học -->
    <div class="class-header bg-white border-bottom shadow-sm">
      <div class="container py-4 px-3">
        <h2 class="fw-bold text-primary mb-1">Lớp Toán 12A1</h2>
      </div>
    </div>

    <!-- Tabs nav -->
    <div class="tabs-nav border-bottom bg-white">
      <div class="container d-flex gap-4 px-3 py-2">
        <div class="tab-item active">Bảng tin</div>
        <div class="tab-item">Bài tập trên lớp</div>
        <div class="tab-item">Mọi người</div>
      </div>
    </div>

    <!-- Nội dung Bảng tin (chứa bài tập) -->
    <div class="container py-4">
      <!-- Bài tập -->
      <div class="assignment-section bg-white shadow-sm rounded-4 border">
        <div
          class="assignment-item border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
        >
          <div class="flex-grow-1">
            <h5 class="fw-semibold text-dark mb-2">Bài 1: Hàm số bậc nhất</h5>
            <p class="text-muted mb-2">
              Mô tả bài tập: Tìm hiểu về đồ thị hàm số bậc nhất, các dạng bài thường gặp trong đề thi.
            </p>
            <p class="text-muted small mb-1"><strong>Mã lớp:</strong> ABC123</p>
            <div class="d-flex align-items-center gap-2 text-muted">
              <img src="https://ui-avatars.com/api/?name=Nguyễn+Văn+A" class="rounded-circle" width="28" height="28" />
              <span class="small">Nguyễn Văn A · 10 tháng 7</span>
            </div>
          </div>
          <div class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-2">Xem</button>
            <button class="btn btn-sm btn-primary">Nộp bài</button>
          </div>
        </div>

        <div
          class="assignment-item p-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
        >
          <div class="flex-grow-1">
            <h5 class="fw-semibold text-dark mb-2">Bài 2: Ôn tập chương I</h5>
            <p class="text-muted mb-2">
              Ôn lại kiến thức về phương trình, bất phương trình, hệ phương trình và áp dụng vào giải toán thực tế.
            </p>
            <p class="text-muted small mb-1"><strong>Mã lớp:</strong> ABC123</p>
            <div class="d-flex align-items-center gap-2 text-muted">
              <img src="https://ui-avatars.com/api/?name=Nguyễn+Văn+A" class="rounded-circle" width="28" height="28" />
              <span class="small">Nguyễn Văn A · 5 tháng 7</span>
            </div>
          </div>
          <div class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-2">Xem</button>
            <button class="btn btn-sm btn-outline-primary">Chỉnh sửa</button>
          </div>
        </div>

        <p class="text-muted text-center py-3 mb-0" v-if="false">Chưa có bài tập nào</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f6f9;
  min-height: 100vh;
}

.class-header {
  background: #fff;
}

.tabs-nav {
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.tab-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 20px;
  color: #444;
  transition: background 0.2s;
}

.tab-item:hover {
  background: #f0f0f0;
}

.tab-item.active {
  background: #e7f1ff;
  color: #007bff;
}

.assignment-section {
  border-radius: 16px;
}

.assignment-item {
  border-bottom: 1px solid #eee;
}
.assignment-item:last-child {
  border-bottom: none;
}
</style>

