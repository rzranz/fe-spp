<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useAdminBillStore } from "../../../stores/admin/bill";

import BillTable from "./components/BillTable.vue";
import GenerateModal from "./components/GenerateModal.vue";
import PaymentModal from "./components/PaymentModal.vue";
import ExportModal from "./components/ExportModal.vue";
import EditModal from "./components/EditModal.vue";
import Pagination from "../../../components/Pagination.vue";

const billStore = useAdminBillStore();
const { 
  bills, fees, classrooms, studentsList, months, 
  isLoading, isProcessing, isEditing, searchQuery, currentPage, lastPage, filters 
} = storeToRefs(billStore);

const showGenerateModal = ref(false);
const showPaymentModal = ref(false);
const showExportModal = ref(false);
const showEditModal = ref(false);
const selectedBill = ref(null);
const billToEdit = ref(null);

let searchTimeout;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => billStore.fetchBills(1), 500);
};

const handleFilterChange = () => {
  billStore.fetchBills(1);
};

const handleGenerate = async (formData, onSuccess) => {
  try {
    const data = await billStore.handleGenerate(formData);
    Swal.fire("Berhasil", data.message, "success");
    if (onSuccess) onSuccess();
  } catch (error) {
    Swal.fire("Gagal", error.response?.data?.message, "error");
  }
};

const handlePayment = async (paymentData, onSuccess) => {
  try {
    await billStore.handlePayment(paymentData);
    Swal.fire("Sukses", "Pembayaran tercatat.", "success");
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
        await billStore.handleDelete(id);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      } catch (error) { Swal.fire("Gagal", "Gagal hapus data", "error"); }
    }
  });
};

const handleEditSubmit = async ({ id, payload }, onSuccess) => {
  try {
    const data = await billStore.handleEditSubmit(id, payload);
    Swal.fire("Berhasil", data.message || "Data diperbarui.", "success");
    if (onSuccess) onSuccess();
  } catch (error) {
    Swal.fire("Gagal", error.response?.data?.message || "Gagal mengubah data.", "error");
  }
};

const handleRemindWA = (id) => {
  Swal.fire({
    title: "Kirim Pengingat WA?", text: "Pesan akan dikirimkan otomatis.", icon: "question", showCancelButton: true, confirmButtonColor: '#10B981', confirmButtonText: "Ya, Kirim!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({ title: 'Mengirim...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
      try {
        const data = await billStore.handleRemindWA(id);
        Swal.fire("Terkirim!", data.message, "success");
      } catch (error) { 
        Swal.fire("Gagal", error.response?.data?.message || "Gagal mengirim notifikasi", "error"); 
      }
    }
  });
};

const openPayModal = (bill) => {
  selectedBill.value = bill;
  showPaymentModal.value = true;
};

const openEditModal = (bill) => {
  if (bill.paid_amount > 0 || bill.status !== "pending") {
    return Swal.fire(
      "Akses Ditolak",
      "Tagihan yang sudah dicicil/dibayar tidak boleh diubah.",
      "warning"
    );
  }
  billToEdit.value = bill;
  showEditModal.value = true;
};

onMounted(() => {
  billStore.fetchClassrooms();
  billStore.fetchFees();
  billStore.fetchActiveStudents();
  billStore.fetchBills();
});
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Kelola Tagihan</h2>
        <p class="mt-1 text-sm text-gray-500">Generate & Monitor Tagihan SPP</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 flex space-x-3">
        <button
          @click="showExportModal = true"
          class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        >
          📥 Export CSV Laporan
        </button>
        <button
          @click="showGenerateModal = true"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          + Generate Tagihan
        </button>
      </div>
    </div>

    <div
      class="bg-white p-4 rounded-lg flex flex-col xl:flex-row gap-4 border border-gray-200 shadow-sm items-start xl:items-center justify-between"
    >
      <div class="flex flex-wrap gap-3 w-full xl:w-auto">
        <select
          v-model="filters.class_id"
          @change="handleFilterChange"
          class="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
        >
          <option value="">Semua Kelas</option>
          <option v-for="cls in classrooms" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>

        <select v-model="filters.fee_id" @change="handleFilterChange" class="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto">
          <option value="">Semua Jenis Tagihan</option>
          <option v-for="fee in fees" :key="fee.id" :value="fee.id">{{ fee.name }}</option>
        </select>
        
        <select
          v-model="filters.month"
          @change="handleFilterChange"
          class="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
        >
          <option value="">Semua Bulan</option>
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>
        <input
          v-model="filters.year"
          @change="handleFilterChange"
          type="number"
          class="rounded-md border-gray-300 text-sm w-full sm:w-24 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          v-model="filters.status"
          @change="handleFilterChange"
          class="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
        >
          <option value="">Semua Status</option>
          <option value="paid">Lunas</option>
          <option value="pending">Belum Lunas</option>
          <option value="partial">Dicicil</option>
        </select>
      </div>

      <div class="w-full xl:w-64">
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="search"
            placeholder="Cari nama siswa..."
            class="block w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>

    <BillTable
      :bills="bills"
      :isLoading="isLoading"
      @pay="openPayModal"
      @delete="handleDelete"
      @edit="openEditModal"
      @remind="handleRemindWA"
    />

    <Pagination
      :currentPage="currentPage"
      :lastPage="lastPage"
      @changePage="billStore.fetchBills"
    />

    <GenerateModal
      :show="showGenerateModal"
      :fees="fees"
      :months="months"
      :students="studentsList"
      :classrooms="classrooms"
      :is-loading="isProcessing"
      @close="showGenerateModal = false"
      @submit="(data) => handleGenerate(data, () => (showGenerateModal = false))"
    />

    <EditModal
      :show="showEditModal"
      :bill="billToEdit"
      :months="months"
      :is-loading="isEditing"
      @close="showEditModal = false"
      @submit="(data) => handleEditSubmit(data, () => (showEditModal = false))"
    />

    <PaymentModal
      :show="showPaymentModal"
      :bill="selectedBill"
      @close="showPaymentModal = false"
      @submit="(data) => handlePayment(data, () => (showPaymentModal = false))"
      @refresh="() => billStore.fetchBills(currentPage)"
    />

    <ExportModal
      :show="showExportModal"
      :classrooms="classrooms"
      :months="months"
      @close="showExportModal = false"
    />
  </div>
</template>
