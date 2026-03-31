<script setup>
const props = defineProps({
  paymentHistory: Array
});

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
    <div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <h3 class="font-bold text-gray-800">Riwayat Transaksi</h3>
    </div>
    
    <div v-if="paymentHistory.length === 0" class="p-5 text-center text-sm text-gray-500">
      Belum ada uang masuk.
    </div>
    
    <div class="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
      <div v-for="trx in paymentHistory" :key="trx.id" class="p-4 hover:bg-gray-50 transition-colors">
        <p class="font-semibold text-gray-900 text-sm">{{ trx.title }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500">{{ trx.date }}</span>
          <span class="font-bold text-green-600 text-sm">+ {{ formatRupiah(trx.amount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 