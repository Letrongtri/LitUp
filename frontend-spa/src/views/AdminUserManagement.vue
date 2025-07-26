<script setup>
import MainPagination from '@/components/MainPagination.vue';
import { useUpdateUserByAdmin, useUsersByAdmin } from '@/composables/useAdmin';
import { formatDate } from '@/utils/format';
import { computed, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const tab = inject('tab');
tab.value = 'users';

const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});
const currentLimit = computed(() => {
  const limit = Number(route.query?.limit);
  if (Number.isNaN(limit) || limit < 1) return 10;
  return limit;
});

const { data, isLoading, error, refetch } = useUsersByAdmin(currentPage, currentLimit);

const users = computed(() => data.value?.users || []);
const totalPages = computed(() => data.value?.metadata.lastPage || 1);

const searchText = ref('');
const searchableUsers = computed(() =>
  users.value.map((user) => {
    const { u_first_name, u_last_name, u_email, u_role } = user;
    return [u_first_name, u_last_name, u_email, u_role].join('').toLowerCase();
  }),
);

const selectedIndex = ref(-1);
const selectedUser = computed(() => {
  if (selectedIndex.value < 0) return null;
  return users.value[selectedIndex.value];
});

const filteredUsers = computed(() => {
  if (!searchText.value) return users.value;
  return users.value.filter((user, index) =>
    searchableUsers.value[index].includes(searchText.value),
  );
});

const updateUserMutation = useUpdateUserByAdmin();
async function deactivateAccount(uid) {
  if (confirm('Do you want to deactivate this account?')) {
    try {
      await updateUserMutation.mutateAsync({ uid, data: { u_status: false } });
    } catch (error) {
      console.log(error);
    }
  }
}

async function activateAccount(uid) {
  if (confirm('Do you want to activate this account?')) {
    try {
      await updateUserMutation.mutateAsync({ uid, data: { u_status: true } });
    } catch (error) {
      console.log(error);
    }
  }
}

function changeCurrentPage(page) {
  router.push({ name: 'admin.users', query: { page, limit: currentLimit.value } });
  refetch();
}
</script>

<template>
  <div v-if="isLoading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="page-container">
    <div class="container">
      <div class="content-section">
        <div class="section-header">
          <h3>Users management</h3>
          <div class="search-box">
            <input
              type="text"
              v-model="searchText"
              class="form-control"
              placeholder="Search by name or email..."
            />
            <button class="btn btn-primary">Find</button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <!-- User table -->
            <table class="user-table table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, index) in filteredUsers"
                  :key="user.uid"
                  :class="{ 'table-active': index === selectedIndex }"
                  @click="selectedIndex = index"
                >
                  <td>{{ user.uid }}</td>
                  <td>{{ user.u_first_name }}</td>
                  <td>{{ user.u_last_name }}</td>
                  <td>{{ user.u_email }}</td>
                  <td>{{ user.u_role }}</td>
                  <td>{{ user.u_status ? 'Active' : 'Inactive' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="">
              <MainPagination
                :total-pages="totalPages"
                :current-page="currentPage"
                @update:current-page="changeCurrentPage"
              />
            </div>
          </div>

          <div v-if="selectedUser" class="col-md-4">
            <div class="card p-3">
              <div class="p-1 w-100 d-flex align-items-center justify-content-center">
                <img class="img-fluid img-thumbnail" :src="selectedUser.avatar_url" alt="avatar" />
              </div>
              <div class="p-1">
                <strong>ID: </strong>
                {{ selectedUser.uid }}
              </div>
              <div class="p-1">
                <strong>First Name: </strong>
                {{ selectedUser.u_first_name }}
              </div>
              <div class="p-1">
                <strong>Last Name: </strong>
                {{ selectedUser.u_last_name }}
              </div>
              <div class="p-1">
                <strong>Email: </strong>
                {{ selectedUser.u_email }}
              </div>
              <div class="p-1">
                <strong>Role: </strong>
                {{ selectedUser.u_role }}
              </div>
              <div class="p-1">
                <strong>Status: </strong>
                {{ selectedUser.u_status ? 'Active' : 'Inactive' }}
              </div>
              <div class="p-1">
                <strong>Created at: </strong>
                {{ formatDate(selectedUser.u_created_at) }}
              </div>
              <div class="p-1">
                <strong>Updated at: </strong>
                {{ formatDate(selectedUser.u_updated_at) }}
              </div>
              <div class="p-1 text-end">
                <button
                  v-if="selectedUser.u_status"
                  @click="deactivateAccount(selectedUser.uid)"
                  class="btn btn-danger"
                >
                  Deactivate
                </button>
                <button v-else @click="activateAccount(selectedUser.uid)" class="btn btn-success">
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 2rem 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}
.page-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.search-box {
  display: flex;
  gap: 0.5rem;
}
.search-box .form-control {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 250px;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th,
.user-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.user-table th {
  background-color: #f8f9fa;
  color: #333;
}
.user-table td button {
  margin-right: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-danger {
  background-color: #dc3545;
  color: white;
}
.btn-outline {
  background: white;
  border: 1px solid #ccc;
  color: #333;
}
.btn-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.6rem;
}
</style>
