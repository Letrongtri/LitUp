<script setup>
import { ref, onMounted } from 'vue';
import usersService from '@/services/users.service';
import { useRoute, useRouter } from 'vue-router';
import EditProfile from '@/components/EditProfile.vue';

const route = useRoute();
const router = useRouter();

const myAccount = ref(false);

const user = ref({});
const error = ref('');
const showModal = ref(false);

async function retrieveUser() {
  try {
    const uid = Number(route.params?.uid);
    const profile = await usersService.getUserById(uid);
    user.value = profile.user;
  } catch (err) {
    error.value = 'Lỗi khi tải hồ sơ: ' + err.message;
  }
  if (user.value && JSON.parse(localStorage.getItem('user')).user.uid === user.value.uid) {
    myAccount.value = true;
  }
}

onMounted(async () => {
  await retrieveUser();
});

async function deleteProfile() {
  if (confirm('Do you want to delete account?')) {
    try {
      const user = JSON.parse(localStorage.getItem('user')).user;

      await usersService.deleteUser(user.uid);
      localStorage.removeItem('user');

      router.push('/');
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
      <div class="profile-card bg-white rounded-4 shadow-sm p-4 p-md-5">
        <!-- Avatar + Name -->
        <div class="text-center mb-4">
          <img
            :src="user.avatar_url"
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
        <div v-if="myAccount" class="d-flex gap-2 justify-content-center">
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
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}

.list-group-item {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-color: #f1f1f1;
}
</style>
