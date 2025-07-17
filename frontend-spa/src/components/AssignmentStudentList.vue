<script setup>
import router from '@/router';

defineProps({
  assignments: { type: Array },
});

function goToAssignmentDetail(id) {
  router.push({ name: 'class.joined.detail', params: { cid: id } });
}

function dowloadFile(attachment) {
  if (!attachment) {
    console.error('Không tìm thấy tệp.');
    return;
  }

  const link = document.createElement('a');
  link.href = `http://localhost:3000/public/uploads/${attachment.f_name}`;
  link.download = attachment.f_original_name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="assignment-list d-flex flex-column gap-3">
    <div
      v-for="assignment in assignments"
      class="assignment-item border rounded-3 p-3 px-4"
      :key="assignment.aid"
    >
      <div>
        <h5 class="mb-1 fw-semibold text-dark" @click="goToAssignmentDetail(assignment.aid)">
          {{ assignment.a_title }}
        </h5>
        <p>{{ assignment.a_description }}</p>
      </div>
      <div
        v-for="attachment in assignment.attachments"
        class="card mb-3"
        style="max-width: 300px"
        :key="attachment.fid"
      >
        <div class="row g-0">
          <div class="col-1 d-flex justify-content-center align-items-center mx-2">
            <i class="fa-regular fa-file fa-2xl"></i>
          </div>
          <div class="col">
            <div class="card-body p-2">
              <h6
                class="card-title cursor-pointer"
                @click="dowloadFile(attachment)"
                style="cursor: pointer"
              >
                {{ attachment.f_original_name }}
              </h6>
              <p class="mb-0">{{ attachment.f_size }} byte</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="assignment-item border rounded-3 p-3 px-4 d-flex justify-content-between align-items-center"
    >
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
</template>
