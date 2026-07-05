<script setup>
import { ref, watch, computed } from "vue";
import Api from "../../../../api/axios";
import Swal from "sweetalert2";

const props = defineProps({
  show: Boolean,
  bill: Object
});

const emit = defineEmits(["close", "submit", "refresh"]);

const isLoading = ref(false);
const isCanceling = ref(false);
const detailBill = ref(null); 
const amount = ref(null);
const notes = ref("");

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const sisaTagihan = computed(() => {
  if (!detailBill.value) return 0;
  return detailBill.value.amount - detailBill.value.paid_amount;
});

// Hanya transaksi sukses yang tampil (untuk kebersihan laporan admin)
const successTransactions = computed(() => {
  if (!detailBill.value?.transactions) return [];
  return detailBill.value.transactions.filter(t => t.status === 'success');
});

// Transaksi pending (untuk info saja)
const pendingTransactions = computed(() => {
  if (!detailBill.value?.transactions) return [];
  return detailBill.value.transactions.filter(t => t.status === 'pending');
});

const fetchBillDetail = async () => {
  if (!props.bill?.id) return;
  isLoading.value = true;
  try {
    const response = await Api.get(`/admin/bills/${props.bill.id}`);
    detailBill.value = response.data.data;
  } catch (error) {
    console.error("Gagal load detail:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    amount.value = null;
    notes.value = "";
    fetchBillDetail();
  } else {
    detailBill.value = null; 
  }
});

const handleBayar = () => {
  if (!amount.value || amount.value < 1000) {
    return Swal.fire("Error", "Nominal minimal Rp 1.000", "error");
  }
  if (amount.value > sisaTagihan.value) {
    return Swal.fire("Error", "Nominal melebihi sisa tagihan", "error");
  }
  emit("submit", {
    bill_id: detailBill.value.id,
    amount: amount.value,
    notes: notes.value
  });
};

const downloadReceipt = async (transaction) => {
  try {
    Swal.fire({
      title: 'Menyiapkan Kwitansi...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    const response = await Api.get(`/admin/transactions/${transaction.id}/receipt`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kwitansi_${transaction.invoice_number}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    Swal.close();
  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', 'Tidak dapat mengunduh kwitansi PDF.', 'error');
  }
};

const batalkanTransaksi = async (transactionId) => {
  Swal.fire({
    title: "Batalkan Transaksi?",
    text: "Pembayaran ini akan dibatalkan dan saldo tagihan dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonText: "Batal",
    confirmButtonText: 'Ya, Batalkan',
  }).then(async (result) => {
    if (result.isConfirmed) {
      isCanceling.value = true;
      try {
        await Api.delete(`/admin/transactions/${transactionId}`);
        Swal.fire("Berhasil", "Transaksi dibatalkan.", "success");
        await fetchBillDetail();
        emit("refresh"); 
      } catch (error) {
        Swal.fire("Gagal", error.response?.data?.message || "Gagal membatalkan", "error");
      } finally {
        isCanceling.value = false;
      }
    }
  });
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal Card -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        <!-- Loading -->
        <div v-if="isLoading" class="flex items-center justify-center py-20 text-slate-500">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Memuat data...
        </div>

        <div v-else-if="detailBill">

          <!-- Header Modal -->
          <div class="px-6 pt-6 pb-5 border-b border-slate-100">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-bold text-slate-800">Detail Tagihan</h3>
                <p class="text-slate-500 text-sm mt-0.5">{{ detailBill.student?.user?.name }} &middot; {{ detailBill.student?.classroom?.name }}</p>
              </div>
              <span :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                detailBill.status === 'paid' ? 'bg-green-100 text-green-700' :
                detailBill.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              ]">
                {{ detailBill.status === 'paid' ? '✓ Lunas' : detailBill.status === 'partial' ? '⏳ Dicicil' : '✗ Belum Bayar' }}
              </span>
            </div>
          </div>

          <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            <!-- Ringkasan Tagihan -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p class="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total Tagihan</p>
                <p class="font-bold text-slate-800 text-base">{{ formatRupiah(detailBill.amount) }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                <p class="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Sudah Dibayar</p>
                <p class="font-bold text-green-700 text-base">{{ formatRupiah(detailBill.paid_amount) }}</p>
              </div>
              <div :class="['rounded-xl p-4 border', sisaTagihan > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100']">
                <p :class="['text-xs font-medium uppercase tracking-wide mb-1', sisaTagihan > 0 ? 'text-red-500' : 'text-green-600']">Sisa Tagihan</p>
                <p :class="['font-bold text-base', sisaTagihan > 0 ? 'text-red-700' : 'text-green-700']">{{ formatRupiah(sisaTagihan) }}</p>
              </div>
            </div>

            <!-- Form Bayar (jika belum lunas) -->
            <form v-if="sisaTagihan > 0" @submit.prevent="handleBayar" class="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <h4 class="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Catat Pembayaran Baru
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nominal (Rp)</label>
                  <input v-model.number="amount" type="number" 
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    :placeholder="`Maks. ${formatRupiah(sisaTagihan)}`" required
                  >
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Catatan (Opsional)</label>
                  <input v-model="notes" type="text" 
                    class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    placeholder="Cth: Bayar tunai di sekolah"
                  >
                </div>
              </div>
              <button type="submit" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Simpan Pembayaran
              </button>
            </form>

            <!-- Sudah Lunas Banner -->
            <div v-else class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-bold text-green-800 text-sm">Tagihan Ini Telah Lunas</p>
                <p class="text-green-600 text-xs">Semua kewajiban pembayaran sudah terpenuhi.</p>
              </div>
            </div>

            <!-- Riwayat Transaksi (Sukses) -->
            <div>
              <h4 class="font-semibold text-slate-700 text-sm mb-3 flex items-center justify-between">
                <span>Riwayat Pembayaran</span>
                <span class="text-xs font-normal text-slate-400">{{ successTransactions.length }} transaksi berhasil</span>
              </h4>

              <div v-if="successTransactions.length === 0" class="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-100">
                Belum ada pembayaran yang berhasil dicatat.
              </div>

              <div v-else class="space-y-2">
                <div v-for="trx in successTransactions" :key="trx.id" 
                  class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors shadow-sm"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-slate-800">{{ formatRupiah(trx.amount) }}</p>
                      <p class="text-xs text-slate-400 font-mono">{{ trx.invoice_number }}</p>
                      <p class="text-xs text-slate-500">{{ formatDate(trx.paid_at) }} &middot; {{ trx.payment_method?.replace('_', ' ')?.toUpperCase() }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button @click="downloadReceipt(trx)" type="button" 
                      class="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                      </svg>
                      PDF
                    </button>
                    <button @click="batalkanTransaksi(trx.id)" :disabled="isCanceling" type="button" 
                      class="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              </div>

              <!-- Info transaksi pending -->
              <div v-if="pendingTransactions.length > 0" class="mt-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-xs text-amber-700">{{ pendingTransactions.length }} transaksi sedang menunggu konfirmasi pembayaran dari gateway.</p>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button @click="emit('close')" type="button" 
            class="px-5 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-100 transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  </div>
</template>