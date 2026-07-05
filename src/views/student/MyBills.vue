<script setup>
import { ref, onMounted } from "vue";
import Api from "../../api/axios";
import Swal from "sweetalert2";
import QrcodeVue from "qrcode.vue";

const bills = ref([]);
const isLoading = ref(false);

const isQrisModalOpen = ref(false);
const qrisString = ref("");
const qrisInvoice = ref("");
const qrisFeeDetail = ref(null);

// 1. Fetch Tagihan Saya
const fetchMyBills = async () => {
  isLoading.value = true;
  try {
    const response = await Api.get("/student/my-bills");
    bills.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// 2. Logic Bayar (Panggil Pakasir API)
const handlePay = async (billId) => {
  try {
    Swal.fire({
      title: "Memproses...",
      text: "Menyiapkan QRIS Tagihan...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await Api.post("/student/pay", { bill_id: billId });

    if (response.data.qris) {
      qrisString.value = response.data.qris;
      qrisInvoice.value = response.data.invoice_number;
      qrisFeeDetail.value = response.data.fee_detail;
      Swal.close();
      isQrisModalOpen.value = true;
    } else {
      Swal.close();
      Swal.fire("Gagal", "QRIS tidak ditemukan dari server.", "error");
    }

  } catch (error) {
    Swal.close();
    Swal.fire("Gagal", error.response?.data?.message || "Gagal memproses pembayaran.", "error");
  }
};

const closeQrisModal = () => {
  isQrisModalOpen.value = false;
  qrisString.value = "";
  qrisInvoice.value = "";
  qrisFeeDetail.value = null;
  fetchMyBills();
};

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

onMounted(() => {
  fetchMyBills();
});
</script>

<template>
  <div class="px-4 py-6 sm:px-0 relative">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Tagihan Saya</h2>
      <p class="text-sm text-gray-500">List tagihan SPP yang harus dibayar.</p>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="bills.length === 0" class="text-center py-10 bg-white rounded-lg shadow">
      <p class="text-gray-500">Hore! Tidak ada tagihan aktif.</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="bill in bills" 
        :key="bill.id" 
        class="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
      >
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': bill.status === 'paid',
                'bg-yellow-100 text-yellow-800': bill.status === 'partial',
                'bg-red-100 text-red-800': bill.status === 'pending'
              }"
            >
              {{ bill.status.toUpperCase() }}
            </span>
            <span class="text-sm text-gray-500">{{ bill.month }} {{ bill.year }}</span>
          </div>

          <h3 class="mt-2 text-lg font-medium text-gray-900">{{ bill.fee?.name || 'Tagihan Sekolah' }}</h3>
          
          <div class="mt-4">
            <p class="text-sm text-gray-500">Total Tagihan</p>
            <p class="text-xl font-bold text-gray-900">{{ formatRupiah(bill.amount) }}</p>
          </div>

          <div class="mt-2" v-if="bill.paid_amount > 0">
            <p class="text-sm text-gray-500">Sudah Dibayar</p>
            <p class="text-sm font-semibold text-green-600">{{ formatRupiah(bill.paid_amount) }}</p>
          </div>

          <div class="mt-2 border-t pt-2" v-if="bill.status !== 'paid'">
            <p class="text-sm text-gray-500">Sisa Tagihan</p>
            <p class="text-lg font-bold text-red-600">
                {{ formatRupiah(bill.amount - bill.paid_amount) }}
            </p>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <button 
            v-if="bill.status !== 'paid'"
            @click="handlePay(bill.id)"
            class="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Bayar Sekarang
          </button>
          <button 
            v-else 
            disabled
            class="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-300 py-2 px-4 text-sm font-medium text-gray-500 cursor-not-allowed"
          >
            Lunas
          </button>
        </div>
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
            <p class="text-gray-500 text-xs font-mono mt-0.5">ID: {{ qrisInvoice }}</p>
          </div>
        </div>

        <!-- Detail Tagihan (Formal Mono) -->
        <div class="px-6 py-5" v-if="qrisFeeDetail">
          <div class="space-y-3 mb-6">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Kepada</p>
              <p class="font-bold text-gray-800">{{ qrisFeeDetail.student_name }}</p>
              <p class="text-sm text-gray-600">{{ qrisFeeDetail.instansi }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Deskripsi</p>
              <p class="font-medium text-gray-700 text-sm">{{ qrisFeeDetail.bill_name }}</p>
            </div>
          </div>

          <!-- Rincian Biaya -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pokok Tagihan</span>
              <span class="font-mono">{{ formatRupiah(qrisFeeDetail.pokok) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <span>Biaya Layanan</span>
              <span class="font-mono">{{ formatRupiah(qrisFeeDetail.admin_fee) }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-800 font-bold">
              <span class="text-sm uppercase tracking-wide">Total Bayar</span>
              <span class="text-lg font-mono text-indigo-700">{{ formatRupiah(qrisFeeDetail.total_bayar) }}</span>
            </div>
          </div>

          <!-- Area QR Code -->
          <div class="flex flex-col items-center">
            <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Scan QRIS untuk Membayar</p>
            <div class="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
              <QrcodeVue :value="qrisString" :size="180" level="M" />
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