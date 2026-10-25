<script setup>
defineProps({
  attachments: { type: Array, default: () => [] },
});

function dowloadFile(attachment) {
  if (!attachment) {
    console.error('Không tìm thấy tệp.');
    return;
  }

  const link = document.createElement('a');
  link.href = `/uploads/${attachment.f_name}`;
  link.download = attachment.f_original_name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="d-flex align-items-center flex-wrap me-3">
    <div
      v-for="attachment in attachments"
      class="card mb-3 me-3"
      style="flex: 0 0 auto; width: 280px"
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
</template>
