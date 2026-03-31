import { ref, reactive } from "vue";
import Swal from "sweetalert2";
import Api from "../api/axios"; // Pastikan path ini benar sesuai struktur lu

export function useBillManagement() {
  // --- 1. STATE MASTER DATA ---
  const bills = ref([]);
  const fees = ref([]);
  const classrooms = ref([]);
  const studentsList = ref([]);
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // --- 2. STATE LOADING & FILTER ---
  const isLoading = ref(false);
  const isProcessing = ref(false);
  const isEditing = ref(false);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const lastPage = ref(1);
  let searchTimeout;

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
  const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => fetchBills(1), 500);
  };

  const handleFilterChange = () => fetchBills(1);

  const handleGenerate = async (formData, onSuccess) => {
    isProcessing.value = true;
    try {
      const response = await Api.post("/admin/bills/generate", formData);
      Swal.fire("Berhasil", response.data.message, "success");
      fetchBills(1);
      if (onSuccess) onSuccess(); // Callback buat nutup modal
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message, "error");
    } finally {
      isProcessing.value = false;
    }
  };

  const handlePayment = async (paymentData, onSuccess) => {
    try {
      await Api.post('/admin/transactions/pay-cash', paymentData);
      Swal.fire("Sukses", "Pembayaran tercatat.", "success");
      fetchBills(currentPage.value);
      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message, "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus?", text: "Data tagihan akan hilang permanen.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Api.delete(`/admin/bills/${id}`);
          fetchBills(currentPage.value);
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        } catch (error) { Swal.fire("Gagal", "Gagal hapus data", "error"); }
      }
    });
  };

  const handleEditSubmit = async ({ id, payload }, onSuccess) => {
    isEditing.value = true;
    try {
      const response = await Api.put(`/admin/bills/${id}`, payload);
      Swal.fire("Berhasil", response.data.message || "Data diperbarui.", "success");
      fetchBills(currentPage.value);
      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message || "Gagal mengubah data.", "error");
    } finally {
      isEditing.value = false;
    }
  };

  const handleRemindWA = (id) => {
    Swal.fire({
      title: "Kirim Pengingat WA?", text: "Pesan akan dikirimkan otomatis.", icon: "question", showCancelButton: true, confirmButtonColor: '#10B981', confirmButtonText: "Ya, Kirim!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Mengirim...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
        try {
          const response = await Api.post(`/admin/bills/${id}/remind`);
          Swal.fire("Terkirim!", response.data.message, "success");
        } catch (error) { 
          Swal.fire("Gagal", error.response?.data?.message || "Gagal mengirim notifikasi", "error"); 
        }
      }
    });
  };

  return {
    bills, fees, classrooms, studentsList, months,
    isLoading, isProcessing, isEditing, searchQuery, currentPage, lastPage, filters,
    fetchClassrooms, fetchFees, fetchActiveStudents, fetchBills,
    handleSearch, handleFilterChange, handleGenerate, handlePayment, handleDelete, handleEditSubmit, handleRemindWA
  };
}