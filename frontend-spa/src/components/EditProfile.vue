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
</script>

<template>
  <div class="bg-white shadow rounded p-4 p-md-5">
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
      <div class="form-switch mb-3">
        <input v-model="editForm.u_status" type="checkbox" class="form-check-input" id="status" />
        <label class="form-check-label" for="status">Status</label>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Avatar: </label>
        <input type="file" class="form-control" @change="handleFileChange" />
      </div>

      <div class="d-flex align-items-center justify-content-end">
        <button type="button" @click="emit('close')" class="btn btn-secondary px-4 py-2 me-3">
          Cancel
        </button>
        <button type="submit" :disabled="updating" class="btn btn-warning px-4 py-2">Edit</button>
      </div>
    </form>
  </div>
</template>
