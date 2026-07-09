import { defineStore } from 'pinia';
import { ref, reactive } from "vue";
import Api from "../../api/axios";

export const useAdminBillStore = defineStore('adminBill', () => {
  // --- 1. STATE MASTER DATA ---
  const bills = ref([]);
  const fees = ref([]);
  const classrooms = ref([]);
  const studentsList = ref([]);
  const months = ref(["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]);

  // --- 2. STATE LOADING & FILTER ---
  const isLoading = ref(false);
  const isProcessing = ref(false);
  const isEditing = ref(false);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const lastPage = ref(1);

  const filters = reactive({
    fee_id: "", 
    class_id: "",
    month: "",
    year: new Date().getFullYear().toString(),
    status: "",
  });

  // --- 3. API FETCHERS ---
  const fetchClassrooms = async () => {
    try {
      const response = await Api.get("/admin/classrooms");
      classrooms.value = response.data.data;
    } catch (error) { console.error("Gagal meload kelas:", error); }
  };

  const fetchFees = async () => {
    try {
      const response = await Api.get("/admin/fees");
      fees.value = response.data.data;
    } catch (error) { console.error("Gagal meload tarif:", error); }
  };

  const fetchActiveStudents = async () => {
    try {
      const response = await Api.get("/admin/students/active");
      studentsList.value = response.data.data;
    } catch (error) { console.error("Gagal meload siswa aktif:", error); }
  };

  const fetchBills = async (page = 1) => {
    try {
      isLoading.value = true;
      const params = { ...filters, page: page, q: searchQuery.value };
      const response = await Api.get("/admin/bills", { params });
      
      bills.value = response.data.data;
      currentPage.value = response.data.meta.current_page;
      lastPage.value = response.data.meta.last_page;
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // --- 4. BUSINESS LOGIC & ACTIONS ---
  const handleGenerate = async (formData) => {
    isProcessing.value = true;
    try {
      const response = await Api.post("/admin/bills/generate", formData);
      await fetchBills(1);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      const response = await Api.post('/admin/transactions/pay-cash', paymentData);
      await fetchBills(currentPage.value);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/admin/bills/${id}`);
      await fetchBills(currentPage.value);
    } catch (error) {
      throw error;
    }
  };

  const handleEditSubmit = async (id, payload) => {
    isEditing.value = true;
    try {
      const response = await Api.put(`/admin/bills/${id}`, payload);
      await fetchBills(currentPage.value);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      isEditing.value = false;
    }
  };

  const handleRemindWA = async (id) => {
    try {
      const response = await Api.post(`/admin/bills/${id}/remind`);
      return response.data;
    } catch (error) { 
      throw error;
    }
  };

  return {
    bills, fees, classrooms, studentsList, months,
    isLoading, isProcessing, isEditing, searchQuery, currentPage, lastPage, filters,
    fetchClassrooms, fetchFees, fetchActiveStudents, fetchBills,
    handleGenerate, handlePayment, handleDelete, handleEditSubmit, handleRemindWA
  };
});
