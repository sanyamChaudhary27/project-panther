import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('panther_user')) || null,
    accessToken: localStorage.getItem('panther_token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
    userEmail: (state) => state.user?.email || null,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/token/`, { email, password });
        this.accessToken = response.data.access;
        this.user = response.data.user;

        localStorage.setItem('panther_token', this.accessToken);
        localStorage.setItem('panther_user', JSON.stringify(this.user));

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
        return true;
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post(`${API_URL}/auth/register/`, userData);
        await this.login(userData.email, userData.password);
        return true;
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem('panther_token');
      localStorage.removeItem('panther_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});