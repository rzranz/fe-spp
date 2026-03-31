<script setup>
import { ref, onMounted } from "vue";
import Api from "../../api/axios";
import Swal from "sweetalert2";

const bills = ref([]);
const isLoading = ref(false);

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

// 2. Logic Bayar (Panggil Midtrans)
const handlePay = async (billId) => {
  try {
    // A. Minta Snap Token ke Backend
    const response = await Api.post("/student/pay", { bill_id: billId });
    const snapToken = response.data.snap_token;

    // B. Panggil Popup Midtrans
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          Swal.fire("Berhasil!", "Pembayaran berhasil!", "success");
          fetchMyBills(); // Refresh data biar jadi lunas
        },
        onPending: function (result) {
          Swal.fire("Pending", "Silakan selesaikan pembayaran Anda.", "info");
          fetchMyBills();
        },
        onError: function (result) {
          Swal.fire("Gagal", "Pembayaran gagal.", "error");
        },
        onClose: function () {
          // User tutup popup tanpa bayar
          console.log('Customer closed the popup without finishing the payment');
        }
      });
    } else {
      Swal.fire("Error", "Library Midtrans belum dimuat. Refresh halaman.", "error");
    }

  } catch (error) {
    Swal.fire("Gagal", error.response?.data?.message || "Gagal memproses pembayaran.", "error");
  }
};

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

onMounted(() => {
  fetchMyBills();
});
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
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
            Bayar Sekarang (Midtrans)
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
  </div>
</template>