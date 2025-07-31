import usersService from '@/services/users.service';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },

    async fetchMe() {
      const user = await usersService.fetchMe();
      this.user = user.data.user;
      return user;
    },
  },
});
