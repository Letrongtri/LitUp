<template>
  <div class="container py-5">
    <!-- Thông tin bài tập -->
    <div class="bg-white p-4 rounded shadow-sm mb-4">
      <h2 class="mb-3 text-primary fw-bold">Bài tập 1: Giới thiệu về HTML</h2>
      <p><strong>Mô tả:</strong> Hãy viết một đoạn giới thiệu ngắn về HTML.</p>
      <p><strong>Hạn nộp:</strong> 2025-07-20</p>
      <p>
        <strong>Trạng thái:</strong>
        <span class="text-success">Đang diễn ra</span>
      </p>

      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-outline-primary">Chỉnh sửa</button>
        <button class="btn btn-outline-danger">Xóa</button>
      </div>
    </div>

    <!-- Danh sách bài nộp -->
    <div class="bg-white p-4 rounded shadow-sm">
      <h4 class="mb-3 text-dark">Danh sách bài nộp</h4>
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Họ tên học viên</th>
            <th>Trạng thái</th>
            <th>Điểm</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyễn Văn A</td>
            <td><span class="text-success">Đã nộp</span></td>
            <td>9</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary">Xem chi tiết</button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Trần Thị B</td>
            <td><span class="text-success">Đã nộp</span></td>
            <td>8</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary">Xem chi tiết</button>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Lê Văn C</td>
            <td><span class="text-danger">Chưa nộp</span></td>
            <td>-</td>
            <td><span class="text-muted">—</span></td>
          </tr>
          <tr>
            <td>4</td>
            <td>Phạm Thị D</td>
            <td><span class="text-success">Đã nộp</span></td>
            <td>10</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary">Xem chi tiết</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Thống kê -->
      <div class="mt-4">
        <p><strong>Tổng đã nộp:</strong> 3</p>
        <p><strong>Chưa nộp:</strong> 1</p>
        <p><strong>Điểm trung bình:</strong> 9.00</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
}
</style>
