<script setup>
import router from '@/router';
import AttachmentList from '@/components/AttachmentList.vue';

const props = defineProps({
  assignments: { type: Array },
  role: { type: String },
});

function goToAssignmentDetail(id) {
  if (props.role === 'student')
    router.push({ name: 'assignment.detail.student', params: { aid: id } });
  else if (props.role === 'teacher')
    router.push({ name: 'assignment.detail.teacher', params: { aid: id } });
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
        <h5
          class="mb-1 fw-semibold text-dark"
          @click="goToAssignmentDetail(assignment.aid)"
          style="cursor: pointer"
        >
          {{ assignment.a_title }}
        </h5>
        <p>{{ assignment.a_description }}</p>
      </div>

      <!-- attachments -->
      <AttachmentList :attachments="assignment.attachments" />
    </div>
  </div>
</template>
