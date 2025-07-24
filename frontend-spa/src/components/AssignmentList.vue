<script setup>
import router from '@/router';
import { formatDate } from '@/utils/format';
// import AttachmentList from '@/components/AttachmentList.vue';

const props = defineProps({
  assignments: { type: Array },
  role: { type: String },
});

function goToAssignmentDetail(id) {
  if (props.role === 'student') router.push(`/student/assignments/${id}`);
  else if (props.role === 'teacher') router.push(`/teacher/assignments/${id}`);
}
console.log(props.assignments);
</script>

<template>
  <div class="assignment-section bg-white shadow-sm rounded-4 border table-hover">
    <div
      v-for="assignment in assignments"
      :key="assignment.aid"
      class="assignment-item border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
    >
      <div class="flex-grow-1">
        <h5
          @click="goToAssignmentDetail(assignment.aid)"
          class="fw-semibold text-dark mb-3"
          style="cursor: pointer"
        >
          {{ assignment.a_title }}
        </h5>
        <p class="mb-2">
          <strong>Description: </strong>
          {{ assignment.a_description }}
        </p>
        <div class="row">
          <div class="col-md-6">
            <p class="mb-2">
              <strong>Deadline:</strong> {{ formatDate(assignment.a_deadline_at) }}
            </p>
            <p class="mb-2">
              <strong>Status:</strong> {{ assignment.a_status ? 'Active' : 'Inactive' }}
            </p>
          </div>
          <div class="col-md-6">
            <p class="mb-2"><strong>Max point: </strong> {{ assignment.a_max_points }}</p>
            <p class="mb-2"><strong>Attachments:</strong> {{ assignment.attachments.length }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
