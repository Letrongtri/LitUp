<script setup>
// import { ref, onMounted } from 'vue';
// import usersService from '@/services/users.service';
// import { useRoute, useRouter } from 'vue-router';

// const route = useRoute();
// const router = useRouter();

// const user = ref(null);
// const error = ref('');

// onMounted(async () => {
//   try {
//     const uid = Number(route.params?.uid);
//     const profile = await usersService.getUserById(uid);
//     user.value = profile.user;
//   } catch (err) {
//     error.value = 'Lỗi khi tải hồ sơ: ' + err.message;
//   }
// });

// function editProfile() {
//   router.push({ name: 'profile.edit', params: { uid: user.value.u_id } });
// }

// function deleteProfile() {
//   alert('⚠️ Tính năng xóa chưa được kích hoạt.');
// }
</script>


<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="profile-card bg-white rounded-4 shadow-sm p-4 p-md-5">
        <!-- Avatar + Tên -->
        <div class="text-center mb-4">
          <img
            src="https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff&size=128"
            class="rounded-circle mb-3"
            width="100"
            height="100"
            alt="Avatar"
          />
          <h3 class="fw-bold text-primary">Nguyễn Văn A</h3>
          <p class="text-muted mb-0">nguyenvana@example.com</p>
        </div>

        <!-- Thông tin chi tiết -->
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item"><strong>Vai trò:</strong> Giáo viên</li>
          <li class="list-group-item">
            <strong>Trạng thái:</strong>
            <span class="text-success">Đang hoạt động</span>
          </li>
          <li class="list-group-item"><strong>ID người dùng:</strong> 123</li>
        </ul>

        <!-- Nút hành động -->
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-outline-primary">Chỉnh sửa</button>
          <button class="btn btn-outline-danger">Xoá hồ sơ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}

.list-group-item {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-color: #f1f1f1;
}
</style>
