import { defineStore } from 'pinia';
import Api from '../../api/axios';

export const useAdminDashboardStore = defineStore('adminDashboard', {
  state: () => ({
    stats: {
      total_students: 0,
      paid_bills_count: 0,
      unpaid_bills_count: 0,
      total_revenue: 0,
      recent_transactions: [],
    },
    isLoading: false,
  }),
  actions: {
    async fetchStats() {
      this.isLoading = true;
      try {
        const response = await Api.get('/admin/dashboard-stats');
        this.stats = response.data;
      } catch (error) {
        console.error("Gagal ambil data dashboard:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
