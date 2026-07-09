<script setup>
import { ref, onMounted } from "vue";
import { useStudentStore } from "../../stores/student";
import { useAuthStore } from "../../stores/auth";
import Swal from "sweetalert2";
import QrcodeVue from "qrcode.vue";

import DashboardHeader from "./components/DashboardHeader.vue";
import BillCard from "./components/BillCard.vue";
import TransactionHistory from "./components/TransactionHistory.vue";
import HelpCard from "./components/HelpCard.vue";
import ArchivedBills from "./components/ArchivedBills.vue";

const studentStore = useStudentStore();
const authStore = useAuthStore();
const isQrisModalOpen = ref(false);

const studentData = authStore.user || {};

const fetchMyBills = async () => {
  try {
    await studentStore.fetchBills();
  } catch (error) {
    Swal.fire("Gagal", "Tidak dapat memuat data tagihan.", "error");
  }
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const processPayment = async (billId, amountToPay) => {
  try {
    Swal.fire({
      title: "Memproses...",
      text: "Menyiapkan QRIS Tagihan...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    
    const success = await studentStore.payBill(billId, amountToPay);

    if (success) {
      Swal.close();
      isQrisModalOpen.value = true;
    } else {
      Swal.close();
      Swal.fire("Gagal", "QRIS tidak ditemukan dari server.", "error");
    }

  } catch (error) {
    Swal.close();
    Swal.fire(
      "Gagal",
      error.response?.data?.message || "Gagal memproses pembayaran.",
      "error"
    );
  }
};

const closeQrisModal = () => {
  isQrisModalOpen.value = false;
  studentStore.clearQrisData();
  fetchMyBills();
};

const handlePayFull = (bill) => processPayment(bill.id, bill.amount - bill.paid_amount);

const handlePayPartial = async (bill) => {
  const sisa = bill.amount - bill.paid_amount;
  const { value: nominal } = await Swal.fire({
    title: "Nominal Cicilan",
    input: "number",
    inputLabel: `Sisa Tagihan: ${formatRupiah(sisa)}`,
    showCancelButton: true,
    confirmButtonText: "Lanjut Bayar",
    inputValidator: (value) => {
      if (!value || value < 10000) return "Minimal cicilan Rp 10.000!";
      if (value > sisa) return "Nominal melebihi sisa tagihan!";
    },
  });
  if (nominal) processPayment(bill.id, parseInt(nominal));
};

onMounted(() => fetchMyBills());
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 relative">
    <DashboardHeader
      :student-data="studentData"
      :bills="studentStore.bills"
      :total-tunggakan="studentStore.totalTunggakan"
    />

    <div v-if="studentStore.isLoading" class="text-center py-12">
      <p class="text-gray-500 font-medium animate-pulse">Memuat data sistem...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-5">
        <h3 class="font-bold text-gray-800 text-xl border-l-4 border-indigo-500 pl-3">
          Tagihan Aktif
        </h3>

        <div
          v-if="studentStore.activeBills.length === 0"
          class="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex items-center gap-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3 class="font-bold">Alhamdulillah!</h3>
            <p>Semua kewajiban administrasi ananda telah lunas.</p>
          </div>
        </div>

        <BillCard
          v-for="bill in studentStore.activeBills"
          :key="bill.id"
          :bill="bill"
          @pay-full="handlePayFull"
          @pay-partial="handlePayPartial"
        />

        <ArchivedBills :history-bills="studentStore.historyBills" />
      </div>

      <div class="lg:col-span-1">
        <TransactionHistory :payment-history="studentStore.paymentHistory" />
        <HelpCard />
      </div>
    </div>

    <!-- Modal QRIS Formal (Invoice Style) -->
    <div v-if="isQrisModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-200">
        
        <!-- Header Invoice -->
        <div class="border-b border-gray-200 bg-gray-50 px-6 py-5 flex items-center gap-4">
          <div class="h-12 w-12 bg-white rounded-md p-1 border border-gray-200 shadow-sm flex-shrink-0">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg uppercase tracking-wide leading-tight">INVOICE SPP</h3>
            <p class="text-gray-500 text-xs font-mono mt-0.5">ID: {{ studentStore.qrisData?.invoice }}</p>
          </div>
        </div>

        <!-- Detail Tagihan (Formal Mono) -->
        <div class="px-6 py-5" v-if="studentStore.qrisData?.feeDetail">
          <div class="space-y-3 mb-6">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Kepada</p>
              <p class="font-bold text-gray-800">{{ studentStore.qrisData.feeDetail.student_name }}</p>
              <p class="text-sm text-gray-600">{{ studentStore.qrisData.feeDetail.instansi }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Deskripsi</p>
              <p class="font-medium text-gray-700 text-sm">{{ studentStore.qrisData.feeDetail.bill_name }}</p>
            </div>
          </div>

          <!-- Rincian Biaya -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pokok Tagihan</span>
              <span class="font-mono">{{ formatRupiah(studentStore.qrisData.feeDetail.pokok) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <span>Biaya Layanan</span>
              <span class="font-mono">{{ formatRupiah(studentStore.qrisData.feeDetail.admin_fee) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-800 font-bold">
              <span class="text-sm uppercase tracking-wide">Total Bayar</span>
              <span class="text-lg font-mono text-indigo-700">{{ formatRupiah(studentStore.qrisData.feeDetail.total_bayar) }}</span>
            </div>
          </div>

          <!-- Area QR Code -->
          <div class="flex flex-col items-center">
            <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Scan QRIS untuk Membayar</p>
            <div class="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
              <QrcodeVue :value="studentStore.qrisData.string" :size="180" level="M" />
            </div>
            <p class="mt-4 text-xs text-center text-gray-500">
              Buka aplikasi M-Banking atau e-Wallet pilihan Anda, lalu scan QR Code di atas.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            @click="closeQrisModal"
            class="w-full py-2.5 rounded-lg bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 transition-colors"
          >
            Tutup & Perbarui Status
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
