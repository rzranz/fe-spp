import { defineStore } from 'pinia';
import Api from '../api/axios';

export const useStudentStore = defineStore('student', {
  state: () => ({
    bills: [],
    isLoading: false,
    qrisData: null,
  }),
  getters: {
    activeBills: (state) => state.bills.filter((b) => b.status !== 'paid'),
    historyBills: (state) => state.bills.filter((b) => b.status === 'paid'),
    totalTunggakan: (state) => state.bills
      .filter((b) => b.status !== 'paid')
      .reduce((total, bill) => total + (bill.amount - bill.paid_amount), 0),
    paymentHistory: (state) => {
      let history = [];
      state.bills.forEach((bill) => {
        if (bill.transactions && bill.transactions.length > 0) {
          const successfulTrx = bill.transactions.filter((trx) => trx.status === "success");
          successfulTrx.forEach((trx) => {
            history.push({
              id: trx.id,
              title: `Pembayaran SPP ${bill.month} ${bill.year}`,
              amount: trx.amount,
              date: new Date(trx.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              rawDate: new Date(trx.created_at),
            });
          });
        }
      });
      return history.sort((a, b) => b.rawDate - a.rawDate);
    }
  },
  actions: {
    async fetchBills() {
      this.isLoading = true;
      try {
        const response = await Api.get('/student/my-bills');
        this.bills = response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async payBill(billId, amount = null) {
      try {
        const payload = { bill_id: billId };
        if (amount) payload.amount = amount;

        const response = await Api.post("/student/pay", payload);

        if (response.data.qris) {
          this.qrisData = {
            string: response.data.qris,
            invoice: response.data.invoice_number,
            feeDetail: response.data.fee_detail
          };
          return true;
        }
        return false;
      } catch (error) {
        throw error;
      }
    },
    clearQrisData() {
      this.qrisData = null;
    }
  }
});
