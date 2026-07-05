<script setup>
defineProps({
  bills: Array
});

const emit = defineEmits(["pay", "delete", "edit", "remind"]);

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const getBillTypeBadge = (feeName) => {
  const name = feeName ? feeName.toLowerCase() : '';
  if (name.includes('spp')) return 'bg-blue-50 text-blue-700 ring-1 ring-blue-100';
  if (name.includes('pomg')) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
  if (name.includes('gedung') || name.includes('upp') || name.includes('pangkal')) return 'bg-purple-50 text-purple-700 ring-1 ring-purple-100';
  return 'bg-slate-50 text-slate-600 ring-1 ring-slate-100';
};

const getStatusBadge = (status) => {
  if (status === 'paid') return { class: 'bg-green-100 text-green-700', label: 'Lunas' };
  if (status === 'partial') return { class: 'bg-amber-100 text-amber-700', label: 'Dicicil' };
  return { class: 'bg-red-100 text-red-700', label: 'Belum Bayar' };
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <table class="min-w-full divide-y divide-slate-100">
      <thead>
        <tr class="bg-slate-50">
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Siswa</th>
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis Tagihan</th>
          <th class="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Periode</th>
          <th class="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
          <th class="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Terbayar</th>
          <th class="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          <th class="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        <tr v-for="bill in bills" :key="bill.id" class="hover:bg-slate-50/60 transition-colors group">

          <!-- Siswa -->
          <td class="px-5 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                {{ bill.student?.user?.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ bill.student?.user?.name || "User Terhapus" }}</p>
                <p class="text-xs text-slate-400">{{ bill.student?.classroom?.name || "-" }}</p>
              </div>
            </div>
          </td>

          <!-- Jenis Tagihan -->
          <td class="px-5 py-4 whitespace-nowrap">
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', getBillTypeBadge(bill.fee?.name)]">
              {{ bill.fee?.name || "Tagihan" }}
            </span>
          </td>

          <!-- Periode -->
          <td class="px-5 py-4 whitespace-nowrap text-sm text-slate-500">
            {{ bill.month }} {{ bill.year }}
          </td>

          <!-- Total -->
          <td class="px-5 py-4 whitespace-nowrap text-sm font-bold text-slate-800 text-right">
            {{ formatRupiah(bill.amount) }}
          </td>

          <!-- Terbayar -->
          <td class="px-5 py-4 whitespace-nowrap text-sm text-right">
            <span :class="bill.paid_amount > 0 ? 'text-green-600 font-semibold' : 'text-slate-400'">
              {{ formatRupiah(bill.paid_amount) }}
            </span>
          </td>

          <!-- Status -->
          <td class="px-5 py-4 whitespace-nowrap text-center">
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', getStatusBadge(bill.status).class]">
              {{ getStatusBadge(bill.status).label }}
            </span>
          </td>

          <!-- Aksi -->
          <td class="px-5 py-4 whitespace-nowrap text-right">
            <div class="flex items-center justify-end gap-2">
              <button v-if="bill.status !== 'paid'" @click="$emit('remind', bill.id)" 
                class="text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors" 
                title="Kirim Pengingat WA"
              >
                Ingatkan
              </button>
              <button @click="$emit('pay', bill)" 
                class="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Detail / Bayar
              </button>
              <button v-if="bill.paid_amount == 0" @click="$emit('edit', bill)" 
                class="text-xs text-slate-500 hover:text-slate-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Edit
              </button>
              <button v-if="bill.paid_amount == 0" @click="$emit('delete', bill.id)" 
                class="text-xs text-red-500 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          </td>

        </tr>

        <tr v-if="bills.length === 0">
          <td colspan="7" class="px-6 py-12 text-center text-sm text-slate-400">
            <div class="flex flex-col items-center gap-2">
              <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Belum ada data tagihan.
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>