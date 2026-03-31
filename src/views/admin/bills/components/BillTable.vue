<script setup>
defineProps({
  bills: Array
});


const emit = defineEmits(["pay", "delete", "edit", "remind"]);

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);
const getBadgeColor = (feeName) => {
  const name = feeName ? feeName.toLowerCase() : '';
  
  if (name.includes('spp')) {
    return 'bg-blue-50 text-blue-700 border-blue-100';
  }
  if (name.includes('pomg')) {
    return 'bg-green-50 text-green-700 border-green-100';
  }
  if (name.includes('gedung') || name.includes('upp') || name.includes('pangkal')) {
    return 'bg-purple-50 text-purple-700 border-purple-100';
  }
  return 'bg-gray-50 text-gray-700 border-gray-100';
};
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Tagihan</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terbayar</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="relative px-6 py-3"><span class="sr-only">Aksi</span></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="bill in bills" :key="bill.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">{{ bill.student?.user?.name || "User Terhapus" }}</div>
            <div class="text-xs text-gray-500">{{ bill.student?.classroom?.name || "-" }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium border', getBadgeColor(bill.fee?.name)]">
              {{ bill.fee?.name || "Tagihan Default" }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ bill.month }} {{ bill.year }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
            {{ formatRupiah(bill.amount) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
            {{ formatRupiah(bill.paid_amount) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="{
                'bg-green-100 text-green-800': bill.status === 'paid',
                'bg-yellow-100 text-yellow-800': bill.status === 'partial',
                'bg-red-100 text-red-800': bill.status === 'pending'
              }">
              {{ bill.status === 'paid' ? 'Lunas' : (bill.status === 'partial' ? 'Dicicil' : 'Belum Lunas') }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
            
            <button v-if="bill.status !== 'paid'" @click="$emit('remind', bill.id)" class="text-green-600 hover:text-green-900 font-bold" title="Kirim Pengingat WA">
              💬 Ingatkan WA
            </button>

            <button @click="$emit('pay', bill)" class="text-blue-600 hover:text-blue-900 font-bold">
              Detail / Bayar
            </button>
            <button v-if="bill.paid_amount == 0" @click="$emit('edit', bill)" class="text-amber-600 hover:text-amber-900">
              Edit
            </button>
            <button v-if="bill.paid_amount == 0" @click="$emit('delete', bill.id)" class="text-red-600 hover:text-red-900">
              Hapus
            </button>
          </td>
        </tr>
        <tr v-if="bills.length === 0">
          <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">Belum ada data tagihan.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>