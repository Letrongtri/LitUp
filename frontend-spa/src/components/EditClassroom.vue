<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import classroomsService from '@/services/classrooms.service';

const route = useRoute();
const router = useRouter();

const cid = route.params.cid;

const emit = defineEmits(['updated', 'close']);
const props = defineProps({
  classroom: { type: Object },
});

const className = ref(props.classroom.c_name);
const error = ref('');
const message = ref('');
const updating = ref(false);
const deleting = ref(false);
const status = ref(props.classroom.c_status);

async function updateClassroom() {
  updating.value = true;
  error.value = '';
  message.value = '';
  
  try {
    await classroomsService.updateClassroom(cid, {
      c_name: className.value,
      c_status: status.value,
    });
    message.value = 'Class update successful!';
    
    emit('updated');
    emit('close');
  } catch (err) {
    error.value = 'Update failed: ' + err.message;
  } finally {
    updating.value = false;
  }
}

async function deleteClassroom() {
  error.value = '';
  message.value = '';
  
  if (confirm('Do you want to delete this classroom?')) {
    deleting.value = true;
    try {
      await classroomsService.deleteClassroom(cid);
      message.value = 'Class deleted successfully!';
      router.push('/teacher/classrooms');
    } catch (err) {
      error.value = 'Delete failed: ' + err.message;
    } finally {
      deleting.value = false;
    }
  }
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
        <button 
          type="button" 
          class="btn-close"
          @click="emit('close')"
          aria-label="Close"
        >
          <i class="fas fa-times"></i>
        </button>

        <h2 class="mb-4 text-primary fw-bold">Edit Classroom</h2>
        
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>
        
        <form @submit.prevent="updateClassroom">
          <div class="mb-3">
            <label for="className" class="form-label fw-semibold">Classroom name: </label>
            <input id="className" type="text" v-model="className" class="form-control" />
          </div>
          
          <div class="form-switch mb-4">
            <input v-model="status" type="checkbox" class="form-check-input" id="status" />
            <label class="form-check-label" for="status">Status</label>
          </div>
          
          <div class="d-flex align-items-center justify-content-end flex-wrap gap-2">
            <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2">
              Cancel
            </button>
            <button type="submit" :disabled="updating" class="btn btn-primary px-4 py-2">
              <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
              Update
            </button>
            <button 
              type="button" 
              @click="deleteClassroom" 
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}


.form-box {
  max-width: 600px;
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

/* Form Controls */
input.form-control {
  border-radius: 10px;
  border: 1px solid #dee2e6;
  padding: 12px 15px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input.form-control:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Form Switch - checkbox styling */
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
  transition: background-color 0.15s ease-in-out, background-position 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-label {
  font-weight: 500;
}

/* Buttons */
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

/* Button Group */
.d-flex.gap-2 {
  gap: 0.5rem;
}

/* Alerts */
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

/* Spinner */
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
  
  .d-flex.gap-2 {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .btn {
    min-width: 80px;
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