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
        <div class="tab-item">Điểm</div>
      </div>
    </div>

    <!-- Bảng tin lớp học -->
    <div class="container py-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card p-3 border">
            <h6 class="fw-semibold mb-1">Mã lớp</h6>
            <p class="text-primary fw-bold">h4czufvb</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card p-3 border">
            <h6 class="fw-semibold mb-1">Sắp đến hạn</h6>
            <p class="text-muted small mb-1">Không có bài tập nào sắp đến hạn</p>
            <a href="#" class="small">Xem tất cả</a>
          </div>
        </div>

        <div class="col-md-12">
          <div class="card p-4 border">
            <div class="d-flex align-items-start gap-2 mb-3">
              <img src="https://ui-avatars.com/api/?name=Nguyễn+Văn+A" class="rounded-circle" width="36" height="36" />
              <div class="flex-grow-1">
                <p class="mb-1 fw-semibold">Nguyễn Văn A</p>
                <p class="mb-0 text-muted small">Thông báo nội dung nào đó cho lớp học của bạn</p>
              </div>
            </div>
            <p class="text-muted">Đây là nơi bạn giao tiếp với lớp học của mình. Sử dụng bảng tin để thông báo, đăng bài tập và trả lời câu hỏi của học viên.</p>
            <button class="btn btn-sm btn-outline-secondary">Cài đặt bảng tin</button>
          </div>
        </div>
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

.card {
  border-radius: 12px;
  background-color: #fff;
}

.card h6 {
  font-size: 1rem;
}
</style>

<script setup>
// KHÔNG gọi API — chỉ UI
</script>
