<script setup>
const props = defineProps({
  historyBills: Array
});

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};
</script>

<template>
  <div v-if="historyBills.length > 0" class="mt-10 space-y-4">
    <h3 class="font-bold text-gray-500 text-lg border-l-4 border-gray-300 pl-3">Tagihan Lunas (Arsip)</h3>
    <div v-for="bill in historyBills" :key="bill.id" class="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
      <div class="flex items-center gap-4">
        <div class="bg-gray-200 text-gray-500 p-2 rounded-lg hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 class="font-bold text-gray-700">SPP Bulan {{ bill.month }} {{ bill.year }}</h4>
          <p class="text-sm text-gray-500 mt-0.5">Total dibayar: {{ formatRupiah(bill.amount) }}</p>
        </div>
      </div>
      <span class="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full ring-1 ring-inset ring-green-200 shadow-sm flex items-center gap-1">
        LUNAS
      </span>
    </div>
  </div>
</template>