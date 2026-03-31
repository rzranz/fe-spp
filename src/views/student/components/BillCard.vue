<script setup>
import { computed } from 'vue';

const props = defineProps({
  bill: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['pay-full', 'pay-partial']);

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const sisaTagihan = computed(() => props.bill.amount - props.bill.paid_amount);
const progressPercent = computed(() => Math.round((props.bill.paid_amount / props.bill.amount) * 100));
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden relative">
    
    <div :class="bill.status === 'partial' ? 'bg-orange-50 border-orange-100' : 'bg-red-50 border-red-100'" class="px-6 py-4 border-b flex justify-between items-center">
      <div class="flex items-center gap-3">
        <h3 class="font-bold text-gray-800 text-lg">SPP Bulan {{ bill.month }} {{ bill.year }}</h3>
      </div>
      <span :class="bill.status === 'partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'" class="text-xs font-black px-3 py-1 rounded-full ring-1 ring-inset shadow-sm">
        {{ bill.status === 'partial' ? 'DICICIL' : 'BELUM LUNAS' }}
      </span>
    </div>
    
    <div class="p-6">
      <div class="flex flex-col xl:flex-row justify-between gap-6 items-center">
        
        <div class="w-full xl:w-1/2">
          <p class="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Sisa Tagihan</p>
          <p class="text-3xl font-extrabold text-gray-900 mb-4">{{ formatRupiah(sisaTagihan) }}</p>
          
          <div v-if="bill.paid_amount > 0" class="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div class="mb-1.5 flex justify-between text-xs font-bold text-gray-700">
              <span>Terbayar: <span class="text-green-600">{{ formatRupiah(bill.paid_amount) }}</span></span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
              <div class="bg-gradient-to-r from-green-400 to-green-500 h-2.5 rounded-full transition-all" :style="{ width: `${progressPercent}%` }"></div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-1/2">
          <button @click="emit('pay-full', bill)" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-sm">
            Bayar Lunas
          </button>
          <button @click="emit('pay-partial', bill)" class="w-full bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold py-3 px-4 rounded-xl transition-all active:scale-95 text-sm">
            Bayar Sebagian
          </button>
        </div>

      </div>
    </div>
  </div>
</template>