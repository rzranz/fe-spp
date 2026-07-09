import { defineStore } from 'pinia';
import Api from '../../api/axios';

export const useAdminClassroomStore = defineStore('adminClassroom', {
  state: () => ({
    classrooms: [],
    studentsInClass: [],
    isLoadingClassrooms: false,
    isLoadingStudents: false,
  }),
  actions: {
    async fetchClassrooms() {
      this.isLoadingClassrooms = true;
      try {
        const response = await Api.get('/admin/classrooms');
        this.classrooms = response.data.data || response.data;
        return this.classrooms;
      } catch (error) {
        throw error;
      } finally {
        this.isLoadingClassrooms = false;
      }
    },
    async createClassroom(name) {
      try {
        await Api.post('/admin/classrooms', { name });
      } catch (error) {
        throw error;
      }
    },
    async updateClassroom(id, name) {
      try {
        await Api.put(`/admin/classrooms/${id}`, { name });
      } catch (error) {
        throw error;
      }
    },
    async deleteClassroom(id) {
      try {
        await Api.delete(`/admin/classrooms/${id}`);
      } catch (error) {
        throw error;
      }
    },
    async fetchClassroomStudents(classId) {
      this.isLoadingStudents = true;
      try {
        const response = await Api.get(`/admin/classrooms/${classId}`);
        this.studentsInClass = response.data.data.students || [];
      } catch (error) {
        throw error;
      } finally {
        this.isLoadingStudents = false;
      }
    },
    async moveStudent(studentId, targetClassId) {
      try {
        await Api.patch(`/admin/students/${studentId}/move-class`, { class_id: targetClassId });
      } catch (error) {
        throw error;
      }
    }
  }
});
