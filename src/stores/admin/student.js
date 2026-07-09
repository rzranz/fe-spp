import { defineStore } from 'pinia';
import Api from '../../api/axios';

export const useAdminStudentStore = defineStore('adminStudent', {
  state: () => ({
    students: [],
    student: null,
    isLoading: false,
    currentPage: 1,
    lastPage: 1,
  }),
  actions: {
    async fetchStudents(page = 1, search = "") {
      this.isLoading = true;
      try {
        const response = await Api.get('/admin/students', {
          params: { page, q: search }
        });
        this.students = response.data.data;
        this.currentPage = response.data.meta.current_page;
        this.lastPage = response.data.meta.last_page;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchStudent(id) {
      try {
        const response = await Api.get(`/admin/students/${id}`);
        this.student = response.data.data;
        return this.student;
      } catch (error) {
        throw error;
      }
    },
    async createStudent(formData) {
      try {
        await Api.post('/admin/students', formData);
      } catch (error) {
        throw error;
      }
    },
    async updateStudent(id, formData) {
      try {
        await Api.put(`/admin/students/${id}`, formData);
      } catch (error) {
        throw error;
      }
    },
    async deleteStudent(id) {
      try {
        await Api.delete(`/admin/students/${id}`);
      } catch (error) {
        throw error;
      }
    },
    async importStudents(formData) {
      try {
        const response = await Api.post('/admin/students/import', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});
