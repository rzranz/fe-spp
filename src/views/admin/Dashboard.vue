<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// --- PERBAIKAN PENTING DI SINI ---
// Ubah dari "../../api" menjadi "../../api/axios"
import api from "../../api/axios"; 
// ---------------------------------

const stats = ref({
  total_students: 0,
  paid_bills_count: 0,
  unpaid_bills_count: 0,
  total_revenue: 0,
  recent_transactions: [],
});

const isLoading = ref(true);

const fetchStats = async () => {
  try {
    const response = await api.get("/admin/dashboard-stats");
    console.log("Data Dashboard:", response.data);
    stats.value = response.data;
  } catch (error) {
    console.error("Gagal ambil data dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

let intervalId = null;

onMounted(() => {
  fetchStats();
  intervalId = setInterval(fetchStats, 5000); // Auto-refresh setiap 5 detik
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
      <p class="text-slate-600">Ringkasan data keuangan sekolah real-time.</p>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <span class="text-slate-500">Memuat data...</span>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div class="text-slate-500 text-sm font-medium mb-1">Total Siswa</div>
          <div class="text-3xl font-bold text-slate-800">
            {{ stats.total_students }}
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div class="text-slate-500 text-sm font-medium mb-1">Tagihan Lunas</div>
          <div class="text-3xl font-bold text-green-600">
            {{ stats.paid_bills_count }}
          </div>
          <p class="text-xs text-slate-400 mt-2">Transaksi selesai</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div class="text-slate-500 text-sm font-medium mb-1">Belum Lunas</div>
          <div class="text-3xl font-bold text-orange-500">
            {{ stats.unpaid_bills_count }}
          </div>
          <p class="text-xs text-slate-400 mt-2">Pending / Partial</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div class="text-slate-500 text-sm font-medium mb-1">Total Uang Masuk</div>
          <div class="text-2xl font-bold text-blue-600 truncate">
            {{ formatRupiah(stats.total_revenue) }}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 class="font-semibold text-slate-800">Transaksi Terbaru Masuk</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-white text-slate-600 uppercase text-xs border-b">
              <tr>
                <th class="px-6 py-3">Siswa</th>
                <th class="px-6 py-3">Pembayaran</th>
                <th class="px-6 py-3">Nominal</th>
                <th class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="trx in stats.recent_transactions" :key="trx.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 font-medium text-slate-900">
                  {{ trx.student?.user?.name || 'Siswa Dihapus' }}
                </td>
                <td class="px-6 py-4">
                  {{ trx.bill?.fee?.name || 'SPP' }}
                  <span class="text-xs text-slate-400 block">{{ trx.invoice_number }}</span>
                </td>
                <td class="px-6 py-4 font-bold text-slate-700">
                  {{ formatRupiah(trx.amount) }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    Paid
                  </span>
                </td>
              </tr>
              
              <tr v-if="stats.recent_transactions.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-slate-400">
                  Belum ada data transaksi.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
