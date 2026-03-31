<script setup>
const props = defineProps({
  studentData: Object,
  bills: Array,
  totalTunggakan: Number
});

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
      <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
        {{ studentData.name ? studentData.name.charAt(0) : 'S' }}
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Selamat datang, Orang Tua {{ studentData.name }}</h2>
        <p class="text-gray-500 text-sm mt-1">
          NIS: {{ bills.length > 0 ? (bills[0].student?.nis || '-') : '-' }} • 
          Kelas: {{ bills.length > 0 ? (bills[0].student?.classroom?.name || 'Menunggu Data') : '-' }}
        </p>
      </div>
    </div>
    
    <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-md p-6 text-white flex flex-col justify-center relative overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10">
        <svg class="h-32 w-32 -mt-4 -mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </div>
      <p class="text-indigo-100 text-sm font-medium mb-1">Total Kewajiban Pembayaran</p>
      <h3 class="text-3xl font-extrabold">{{ formatRupiah(totalTunggakan) }}</h3>
    </div>
  </div>
</template>