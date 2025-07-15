import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  function setUser(data) {
    user.value = data;
    localStorage.setItem('user', JSON.stringify(data));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  function initFromLocalStorage() {
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      if (stored) user.value = stored;
    } catch (e) {
      logout();
    }
  }

  return { user, setUser, logout, initFromLocalStorage };
});
