<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import assignmentsService from '@/services/assignments.service';
import { formatDateToDateTimeLocal } from '@/utils/format';
import classroomsService from '@/services/classrooms.service';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['updated', 'close']);
const props = defineProps({
  assignment: { type: Object, default: () => {} },
  task: { type: String },
});

const cid = Number(route.params.cid ?? '');
const aid = Number(route.params.aid ?? '');
const title = ref('');
const description = ref('');
const status = ref(true);
const maxPoints = ref('');
const deadline = ref('');
const allowLate = ref(false);
const files = ref([]);

const message = ref('');
const error = ref('');
const handling = ref(false);

watchEffect(() => {
  if (props.task === 'update' && props.assignment) {
    title.value = props.assignment.a_title ?? '';
    description.value = props.assignment.a_description ?? '';
    status.value = props.assignment.a_status ?? true;
    maxPoints.value = props.assignment.a_max_points ?? '';
    deadline.value = formatDateToDateTimeLocal(props.assignment.a_deadline_at ?? '') ?? '';
    allowLate.value = props.assignment.a_allow_late_submission ?? false;
  }
});

async function handleAssignment() {
  handling.value = true;
  error.value = '';
  message.value = '';

  try {
    const date = new Date();
    const deadlineTimestamp = date.toISOString(deadline.value);

    const formData = new FormData();
    formData.append('a_title', title.value);
    formData.append('a_description', description.value);
    formData.append('a_status', status.value);
    formData.append('a_max_points', maxPoints.value);
    formData.append('a_deadline_at', deadlineTimestamp);
    formData.append('a_allow_late_submission', allowLate.value);

    Array.from(files.value).forEach((file) => {
      formData.append('attachments', file);
    });

    if (props.task === 'update') {
      await assignmentsService.updateAssignment(aid, formData);
      message.value = 'Update successfully!';
    } else if (props.task === 'create') {
      await classroomsService.createAssignment(cid, formData);
      message.value = 'Add successfully!';
    }

    emit('updated');
    emit('close');
  } catch (err) {
    if (props.task === 'update') error.value = 'Editing failed: ' + err.message;
    else if (props.task === 'create') error.value = 'Creating failed: ' + err.message;
  } finally {
    handling.value = false;
  }
}

async function deleteAssignment() {
  error.value = '';
  message.value = '';

  if (confirm('Do you want to delete this assignment?')) {
    try {
      await assignmentsService.deleteAssignment(props.assignment.aid);
      message.value = 'Cập nhật lớp học thành công!';
      router.push(`/teacher/classrooms/${props.assignment.cid}`);
    } catch (err) {
      error.value = 'Cập nhật thất bại: ' + err.message;
    }
  }
}

function handleFileChange(e) {
  files.value = Array.from(e.target.files);
}
</script>

<template>
  <div class="form-box bg-white shadow rounded p-4 p-md-5 my-4">
    <h2 class="mb-4 text-primary fw-bold">{{ task === 'create' ? 'Add' : 'Edit' }} Assignment</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="message" class="alert alert-success">{{ message }}</div>

    <form @submit.prevent="handleAssignment" enctype="multipart/form-data">
      <div class="mb-3">
        <label class="form-label fw-semibold">Title: </label>
        <input
          v-model="title"
          type="text"
          class="form-control"
          placeholder="Your assignment title"
          :required="task === 'create'"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Description: </label>
        <textarea
          v-model="description"
          class="form-control"
          rows="4"
          placeholder="Your assignment description"
        ></textarea>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold">Max grade: </label>
          <input
            v-model="maxPoints"
            type="number"
            class="form-control"
            placeholder="Your assignment max grade"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold">Deadline: </label>
          <input v-model="deadline" type="datetime-local" class="form-control" />
        </div>
      </div>

      <div class="row g-3 mb-3 mx-1">
        <div class="col-md-6 form-check form-switch mb-3">
          <input v-model="status" type="checkbox" class="form-check-input" id="status" />
          <label class="form-check-label" for="status">Status</label>
        </div>

        <div class="col-md-6 form-check form-switch mb-3">
          <input v-model="allowLate" type="checkbox" class="form-check-input" id="allowLate" />
          <label class="form-check-label" for="allowLate">Allow late submission</label>
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">New attachments (optional)</label>
        <input type="file" multiple class="form-control" @change="handleFileChange" />
      </div>

      <div class="d-flex align-items-center justify-content-end">
        <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
          Cancel
        </button>
        <button type="submit" :disabled="handling" class="btn btn-primary px-4 py-2 me-3">
          {{ task === 'create' ? 'Create' : 'Update' }}
        </button>
        <button
          v-if="task === 'update'"
          type="button"
          @click="deleteAssignment"
          class="btn btn-danger px-4 py-2"
        >
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-box {
  max-width: 700px;
  margin: 0 auto;
  border-radius: 16px;
}

input.form-control,
textarea.form-control,
select.form-control {
  border-radius: 10px;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
}
</style>
