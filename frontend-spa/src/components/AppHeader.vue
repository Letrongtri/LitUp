<script setup>
import { eventBus } from '@/eventBus';
import { useAuthStore } from '@/stores/auth';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const user = ref(authStore.user);

function handleLogout() {
  if (confirm('Do you want to log out?')) {
    authStore.logout();
    router.push('/auth');
  }
}

function goToProfilePage() {
  router.push({ name: 'profile' });
}

function goToHomePage() {
  router.push('/');
}

// Listen for profile update event
function reloadUser() {
  user.value = authStore.user;
}

onMounted(() => {
  eventBus.on('profile-updated', reloadUser);
});

onBeforeUnmount(() => {
  eventBus.off('profile-updated', reloadUser);
});
</script>

<template>
  <nav class="simple-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo" @click="goToHomePage">LitUp!</div>

      <!-- User Account -->
      <div class="user-account">
        <div class="dropdown">
          <button class="user-button" data-bs-toggle="dropdown" aria-expanded="false">
            <img
              :src="`http://localhost:3000${user.avatar_url}`"
              :alt="user.u_first_name"
              class="user-avatar"
            />
            <span class="user-name">{{ user.u_first_name }} {{ user.u_last_name }}</span>
            <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 12 12">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" @click="goToProfilePage()">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  ></path>
                </svg>
                Settings
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item text-danger" @click="handleLogout">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.simple-header {
  background: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1300px;
  margin: 0 auto;
}

/* Logo */
.logo {
  font-size: 1.75rem;
  font-weight: 700;
  color: #007bff;
  cursor: pointer;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #0056b3;
}

/* User Account */
.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-button:hover {
  background-color: #f8f9fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #495057;
  font-size: 0.95rem;
}

.dropdown-icon {
  color: #6c757d;
  transition: transform 0.2s ease;
}

.user-button[aria-expanded='true'] .dropdown-icon {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 180px;
  right: 0;
  left: auto;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.dropdown-item svg {
  opacity: 0.7;
}

.dropdown-item:hover svg {
  opacity: 1;
}

.dropdown-item.text-danger {
  color: #dc3545;
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #dc3545;
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #dee2e6;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .user-name {
    display: none;
  }

  .user-button {
    padding: 0.25rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.75rem;
  }

  .logo {
    font-size: 1.3rem;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
  }
}
</style>
