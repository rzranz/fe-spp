<script setup>
import { onMounted, onUnmounted, computed } from "vue";
import { useAdminDashboardStore } from "../../stores/admin/dashboard";
import VueApexCharts from "vue3-apexcharts";

const dashboardStore = useAdminDashboardStore();

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

let intervalId = null;

onMounted(() => {
  dashboardStore.fetchStats();
  intervalId = setInterval(() => dashboardStore.fetchStats(), 5000); // Auto-refresh setiap 5 detik
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Setup Chart Data
const chartSeries = computed(() => {
  if (!dashboardStore.stats.revenue_by_fee) return [];
  return dashboardStore.stats.revenue_by_fee.map(item => Number(item.total));
});

const chartOptions = computed(() => {
  return {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: dashboardStore.stats.revenue_by_fee?.map(item => item.name) || [],
    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', color: '#64748b' },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              formatter: function (val) {
                return formatRupiah(val);
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Pemasukan',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748b',
              formatter: function (w) {
                return formatRupiah(dashboardStore.stats.total_revenue);
              }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#ffffff'] },
    legend: { position: 'bottom', markers: { radius: 12 } },
    tooltip: {
      y: {
        formatter: function(value) {
          return formatRupiah(value);
        }
      }
    }
  };
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
      <p class="text-slate-600">Ringkasan data keuangan sekolah real-time.</p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading && !dashboardStore.stats.total_students" class="flex items-center justify-center py-20 text-indigo-600 bg-white shadow-sm border border-slate-200 rounded-xl">
      <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="font-medium">Memuat data...</span>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="text-slate-500 text-sm font-medium mb-1">Total Siswa</div>
          <div class="text-3xl font-bold text-slate-800">
            {{ dashboardStore.stats.total_students }}
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="text-slate-500 text-sm font-medium mb-1">Tagihan Lunas</div>
          <div class="text-3xl font-bold text-green-600">
            {{ dashboardStore.stats.paid_bills_count }}
          </div>
          <p class="text-xs text-slate-400 mt-2">Transaksi selesai</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="text-slate-500 text-sm font-medium mb-1">Belum Lunas</div>
          <div class="text-3xl font-bold text-orange-500">
            {{ dashboardStore.stats.unpaid_bills_count }}
          </div>
          <p class="text-xs text-slate-400 mt-2">Pending / Partial</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="text-slate-500 text-sm font-medium mb-1">Total Uang Masuk</div>
          <div class="text-2xl font-bold text-blue-600 truncate">
            {{ formatRupiah(dashboardStore.stats.total_revenue) }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Tabel Transaksi Terbaru -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2 flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 class="font-semibold text-slate-800">Transaksi Terbaru Masuk</h3>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full text-sm text-left">
              <thead class="bg-white text-slate-600 uppercase text-xs border-b">
                <tr>
                  <th class="px-6 py-3">Siswa</th>
                  <th class="px-6 py-3">Pembayaran</th>
                  <th class="px-6 py-3 text-right">Nominal</th>
                  <th class="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="trx in dashboardStore.stats.recent_transactions" :key="trx.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                        {{ trx.student?.user?.name?.charAt(0)?.toUpperCase() || '?' }}
                      </div>
                      {{ trx.student?.user?.name || 'Siswa Dihapus' }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-semibold text-slate-700">{{ trx.bill?.fee?.name || 'SPP' }}</span>
                    <span class="text-[11px] text-slate-400 block mt-0.5 font-mono">{{ trx.invoice_number }}</span>
                  </td>
                  <td class="px-6 py-4 font-bold text-slate-700 text-right">
                    {{ formatRupiah(trx.amount - (trx.admin_fee || 0)) }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                      Lunas
                    </span>
                  </td>
                </tr>
                
                <tr v-if="dashboardStore.stats.recent_transactions?.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400">
                    <div class="flex flex-col items-center justify-center">
                      <svg class="w-10 h-10 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Belum ada data transaksi.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Grafik Pendapatan Berdasarkan Jenis Tagihan -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 class="font-semibold text-slate-800">Komposisi Pendapatan</h3>
          </div>
          
          <div class="p-6 flex-1 flex flex-col justify-center items-center">
            <div v-if="chartSeries.length > 0" class="w-full relative">
              <VueApexCharts 
                type="donut" 
                height="320" 
                :options="chartOptions" 
                :series="chartSeries" 
              />
            </div>
            <div v-else class="text-center text-slate-400 py-10 flex flex-col items-center">
              <svg class="w-10 h-10 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
              Belum ada data pemasukan.
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
