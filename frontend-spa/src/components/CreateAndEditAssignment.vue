<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatDateToDateTimeLocal } from '@/utils/format';
import {
  useCreateAssignment,
  useDeleteAssignment,
  useUpdateAssignment,
} from '@/composables/useAssignment';

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
const deleting = ref(false);

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

const updateAssignmentMutation = useUpdateAssignment();
const createAssignmentMutation = useCreateAssignment();
const deleteAssignmentMutation = useDeleteAssignment();

async function handleAssignment() {
  handling.value = true;
  error.value = '';
  message.value = '';

  try {
    const date = new Date(deadline.value);
    const deadlineTimestamp = date.toISOString();

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
      await updateAssignmentMutation.mutateAsync({ aid, payload: formData });
      message.value = 'Update successfully!';
    } else if (props.task === 'create') {
      await createAssignmentMutation.mutateAsync({ cid, payload: formData });
      message.value = 'Add successfully!';
    }

    emit('updated');
    setTimeout(() => {
      emit('close');
    }, 1500);
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
    deleting.value = true;
    try {
      await deleteAssignmentMutation.mutateAsync(props.assignment.aid);
      message.value = 'Class update successful!';
      router.push(`/teacher/classrooms/${props.assignment.cid}`);
    } catch (err) {
      error.value = 'Delete failed: ' + err.message;
    } finally {
      deleting.value = false;
    }
  }
}

function handleFileChange(e) {
  files.value = Array.from(e.target.files);
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}
</script>

<template>
  <!-- Modal Backdrop -->
  <div class="modal-backdrop" @click="handleBackdropClick">
    <!-- Modal Container -->
    <div class="modal-container">
      <div class="form-box bg-white shadow rounded p-4 p-md-5">
        <!-- Close Button -->
        <button type="button" class="btn-close" @click="emit('close')" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>

        <h2 class="mb-4 text-primary fw-bold">
          {{ task === 'create' ? 'Add' : 'Edit' }} Assignment
        </h2>

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

          <div class="switch-container mb-3">
            <div class="form-check form-switch">
              <input v-model="status" type="checkbox" class="form-check-input" id="status" />
              <label class="form-check-label" for="status">Status</label>
            </div>

            <div class="form-check form-switch">
              <input v-model="allowLate" type="checkbox" class="form-check-input" id="allowLate" />
              <label class="form-check-label" for="allowLate">Allow late submission</label>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">New attachments (optional)</label>
            <input type="file" multiple class="form-control" @change="handleFileChange" />
            <div v-if="files.length > 0" class="file-list mt-2">
              <small class="text-muted">Selected files: {{ files.length }}</small>
              <div class="selected-files">
                <span v-for="(file, index) in files" :key="index" class="file-tag">
                  {{ file.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-end flex-wrap gap-2">
            <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2">
              Cancel
            </button>
            <button type="submit" :disabled="handling" class="btn btn-primary px-4 py-2">
              <span v-if="handling" class="spinner-border spinner-border-sm me-2"></span>
              {{ task === 'create' ? 'Create' : 'Update' }}
            </button>
            <button
              v-if="task === 'update'"
              type="button"
              @click="deleteAssignment"
              :disabled="deleting"
              class="btn btn-danger px-4 py-2"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 20px;
}

.modal-container {
  position: relative;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-box {
  max-width: 700px;
  margin: 0 auto;
  border-radius: 16px;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.btn-close:hover {
  background-color: #f8f9fa;
  color: #495057;
}

input.form-control,
textarea.form-control,
select.form-control {
  border-radius: 10px;
  border: 1px solid #dee2e6;
  padding: 12px 15px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

input.form-control:focus,
textarea.form-control:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.switch-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.form-switch {
  padding-left: 2.5em;
}

.form-check-input {
  width: 2em;
  height: 1em;
  margin-left: -2.5em;
  background-image: none;
  background-color: #dee2e6;
  border: 1px solid #adb5bd;
  border-radius: 2em;
  transition:
    background-color 0.15s ease-in-out,
    background-position 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-label {
  font-weight: 500;
}

.file-list {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selected-files {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-tag {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  border: 1px solid #bbdefb;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-danger:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
}

.gap-2 {
  gap: 0.5rem;
}

.alert {
  border-radius: 8px;
  font-size: 0.95rem;
  border: none;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-success {
  background-color: #d1e7dd;
  color: #0a3622;
}

.form-label {
  margin-bottom: 0.5rem;
  color: #495057;
}

.row .col-md-6 {
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 10px;
  }

  .form-box {
    padding: 20px !important;
  }

  .btn-close {
    top: 10px;
    right: 10px;
  }

  .row .col-md-6 {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    margin-bottom: 1rem;
  }

  .switch-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .gap-2 {
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    min-width: 100px;
  }
}

.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
