<template>
  <div class="page-container bg-light py-4">
    <div class="container">
      <!-- Tiêu đề bài tập -->
      <div class="bg-white p-4 rounded shadow-sm mb-4 border">
        <h3 class="fw-bold text-primary mb-2">Final Project Report</h3>
        <p class="text-muted mb-0">Môn: Web Technologies and Services — Học kỳ 3 (2024-2025)</p>
        <p class="text-muted mb-0">Lớp: Chemistry Games</p>
      </div>

      <!-- Khung nội dung bài nộp -->
      <div class="bg-white p-4 rounded shadow-sm border d-flex flex-column flex-md-row gap-4">
        <!-- Bên trái: File báo cáo -->
        <div class="flex-fill">
          <iframe
            src="URL_FILE_PDF"
            width="100%"
            height="500px"
            style="border: none;"
          ></iframe>
        </div>

        <!-- Bên phải: Chi tiết và nhận xét -->
        <div class="flex-fill" style="max-width: 350px;">
          <h6 class="fw-semibold">Thông tin sinh viên</h6>
          <ul class="list-unstyled small">
            <li><strong>Họ tên:</strong> Lê Nguyễn Gia Phúc</li>
            <li><strong>MSSV:</strong> B2206002</li>
            <li><strong>Trạng thái:</strong> <span class="badge bg-success">Đã nộp</span></li>
            <li><strong>Ngày nộp:</strong> 27 tháng 6</li>
          </ul>

          <hr />

          <h6 class="fw-semibold">Nhận xét giảng viên</h6>
          <textarea class="form-control mb-2" rows="4" placeholder="Nhập nhận xét..."></textarea>
          <button class="btn btn-primary btn-sm">Gửi nhận xét</button>
        </div>
      </div>
    </div>
  </div>
</template>
