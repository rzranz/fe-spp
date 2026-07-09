import { defineStore } from 'pinia';
import Api from '../../api/axios';

export const useAdminFeeStore = defineStore('adminFee', {
  state: () => ({
    fees: [],
    isLoading: false,
  }),
  actions: {
    async fetchFees() {
      this.isLoading = true;
      try {
        const response = await Api.get('/admin/fees');
        this.fees = response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async createFee(payload) {
      try {
        await Api.post('/admin/fees', payload);
      } catch (error) {
        throw error;
      }
    },
    async updateFee(id, payload) {
      try {
        await Api.put(`/admin/fees/${id}`, payload);
      } catch (error) {
        throw error;
      }
    },
    async deleteFee(id) {
      try {
        const response = await Api.delete(`/admin/fees/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
});
