<script setup>
import { ref } from 'vue';
import { eventBus } from '@/eventBus';
import { useUpdateUser } from '@/composables/useUser';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['updated', 'close']);
const props = defineProps({
  user: Object,
});
const updateUserMutation = useUpdateUser();
const authStore = useAuthStore();

const editForm = ref({
  u_first_name: props.user.u_first_name,
  u_last_name: props.user.u_last_name,
  u_email: props.user.u_email,
  u_status: props.user.u_status,
  u_password: '',
  u_avatar_file: [],
});

const confirmPassword = ref('');

const message = ref('');
const error = ref('');
const updating = ref(false);

async function editProfile() {
  updating.value = true;
  error.value = '';
  message.value = '';

  try {
    if (editForm.value.u_password) {
      if (editForm.value.u_password !== confirmPassword.value) {
        error.value = 'Confirmation password does not match!';
        return;
      }
    }

    const formData = new FormData();
    formData.append('u_first_name', editForm.value.u_first_name);
    formData.append('u_last_name', editForm.value.u_last_name);
    formData.append('u_email', editForm.value.u_email);
    formData.append('u_status', editForm.value.u_status);
    if (editForm.value.u_password) {
      formData.append('u_password', editForm.value.u_password);
    }
    if (editForm.value.u_avatar_file.length > 0) {
      formData.append('u_avatar_file', editForm.value.u_avatar_file[0]);
    }

    const updatedProfile = await updateUserMutation.mutateAsync(formData);

    message.value = 'Edit successfully!';

    await authStore.fetchMe();
    eventBus.emit('profile-updated');

    emit('updated');
    emit('close');
  } catch (err) {
    error.value = err.message;
  } finally {
    updating.value = false;
  }
}

function handleFileChange(e) {
  editForm.value.u_avatar_file = Array.from(e.target.files);
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
          ×
        </button>

        <h2 class="mb-4 text-primary fw-bold">Edit Profile</h2>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="message" class="alert alert-success">{{ message }}</div>

        <form @submit.prevent="editProfile" enctype="multipart/form-data">
          <div class="row mb-3">
            <div class="col">
              <label for="firstName" class="form-label fw-semibold">First name: </label>
              <input
                id="firstName"
                v-model="editForm.u_first_name"
                type="text"
                class="form-control mb-2"
                placeholder="First name"
              />
            </div>

            <div class="col">
              <label for="lastName" class="form-label fw-semibold">Last name: </label>
              <input
                id="lastName"
                v-model="editForm.u_last_name"
                type="text"
                class="form-control mb-2"
                placeholder="Last name"
              />
            </div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label fw-semibold">Email: </label>
            <input
              id="email"
              v-model="editForm.u_email"
              type="email"
              class="form-control mb-3"
              placeholder="Email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label fw-semibold">Password: </label>
            <input
              id="password"
              v-model="editForm.u_password"
              type="password"
              class="form-control mb-3"
              placeholder="Password"
            />
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label fw-semibold">Confirm password: </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-control mb-3"
              placeholder="Enter password again"
            />
          </div>

          <!-- Status Toggle to match classroom style -->
          <div class="mb-3">
            <div class="d-flex align-items-center">
              <div class="status-toggle-container">
                <input
                  v-model="editForm.u_status"
                  type="checkbox"
                  class="status-toggle"
                  id="status"
                />
                <label class="status-toggle-slider" for="status"></label>
              </div>
              <label class="form-label fw-semibold ms-3 mb-0" for="status">Status</label>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Avatar: </label>
            <input type="file" class="form-control" @change="handleFileChange" accept="image/*" />
          </div>

          <div class="d-flex align-items-center justify-content-end">
            <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
              Cancel
            </button>
            <button type="submit" :disabled="updating" class="btn btn-warning px-4 py-2">
              <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
              {{ updating ? 'Updating...' : 'Edit' }}
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
  font-size: 1.5rem;
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
  font-weight: bold;
}

.btn-close:hover {
  background-color: #f8f9fa;
  color: #495057;
}

input.form-control {
  border-radius: 10px;
  border: 1px solid #dee2e6;
  padding: 12px 15px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

input.form-control:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Classroom-style Status Toggle */
.status-toggle-container {
  position: relative;
  display: inline-block;
}

.status-toggle {
  opacity: 0;
  width: 0;
  height: 0;
}

.status-toggle-slider {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: #e9ecef;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #dee2e6;
}

.status-toggle:checked + .status-toggle-slider {
  background-color: #007bff;
  border-color: #007bff;
}

.status-toggle-slider:hover {
  opacity: 0.9;
}

button.btn {
  font-weight: 600;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.btn-warning:hover:not(:disabled) {
  background-color: #ffca2c;
  border-color: #ffc720;
  color: #000;
}

.btn-warning:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
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

  .modal-container {
    max-width: 100%;
  }
}
</style>