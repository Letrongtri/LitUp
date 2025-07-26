<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EditProfile from '@/components/EditProfile.vue';
import { useAuthStore } from '@/stores/auth';
import { useDeleteUser } from '@/composables/useUser';
import { DEFAULT_AVATAR } from '@/constants';

const router = useRouter();
const authStore = useAuthStore();

const user = ref({});
const error = ref('');
const showModal = ref(false);

const deleteUserMultation = useDeleteUser();

onMounted(async () => {
  user.value = authStore.user;
});

async function retrieveUser() {
  try {
    await authStore.fetchMe();
    user.value = authStore.user;
  } catch (err) {
    error.value = err.message;
  }
}

async function deleteProfile() {
  if (confirm('Do you want to delete account?')) {
    try {
      await deleteUserMultation.mutateAsync();
      authStore.clearToken();
      router.push('/auth');
      alert('Your account has been deleted!');
    } catch (err) {
      error.value = err.message;
    }
  }
}
</script>

<template>
  <div class="page-container bg-light py-5">
    <div class="container">
      <div class="profile-card bg-white rounded shadow-sm p-4 p-md-5">
        <!-- Avatar + Name -->
        <div class="text-center mb-4">
          <img
            :src="user.avatar_url || DEFAULT_AVATAR"
            class="rounded-circle mb-3"
            width="100"
            height="100"
            alt=""
            style="object-fit: cover"
          />
          <h3 class="fw-bold text-primary">{{ user.u_first_name }} {{ user.u_last_name }}</h3>
          <p class="text-muted mb-0">{{ user.u_email }}</p>
        </div>

        <!-- Details -->
        <ul class="list-group list-group-flush mb-4">
          <li class="list-group-item"><strong>Role: </strong>{{ user.u_role }}</li>
          <li class="list-group-item">
            <strong>Status: </strong>
            <span class="text-success">{{ user.u_status ? 'Active' : 'Inactive' }}</span>
          </li>
        </ul>
        <!-- Action button -->
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-warning" @click="showModal = true">Edit</button>
          <button class="btn btn-danger" @click="deleteProfile">Delete</button>
        </div>
      </div>

      <EditProfile
        v-if="showModal"
        @updated="retrieveUser"
        @close="showModal = false"
        :user="user"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Poppins', sans-serif;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 0.375rem; /* Đồng bộ với EditProfile component */
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
}

h3 {
  font-size: 1.8rem;
  font-weight: 700;
}

.text-muted {
  font-size: 1.05rem;
  color: #6c757d;
}

.list-group-item {
  font-size: 1.05rem;
  padding: 0.75rem 1rem;
  border-color: #f1f1f1;
}

.btn {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
}
</style>
