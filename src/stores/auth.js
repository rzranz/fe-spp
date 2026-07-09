import { defineStore } from 'pinia';
import Api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await Api.post("/login", { email, password });
        
        const token = response.data?.token;
        const user = response.data?.user;

        if (!token || !user) {
          throw new Error("Respon server tidak valid (Token/User hilang).");
        }

        this.token = token;
        this.user = user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return user;
      } catch (error) {
        throw error;
      }
    },
    async logout() {
      try {
        if (this.token) {
          await Api.post('/logout');
        }
      } catch (error) {
        console.error('Logout error dari server, tetap bersihkan data lokal.', error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete Api.defaults.headers.common["Authorization"];
      }
    }
  }
});
