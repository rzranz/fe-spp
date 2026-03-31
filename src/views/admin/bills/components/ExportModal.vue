<script setup>
import { reactive, watch } from 'vue';
import Swal from 'sweetalert2';
import Api from '../../../../api/axios';

const props = defineProps({
  show: Boolean,
  classrooms: Array,
  months: Array,
});

const emit = defineEmits(['close']);

const exportFilters = reactive({
  class_id: "",
  month: "",
  year: new Date().getFullYear().toString(),
  status: "",
});

// Reset form kalau modal ditutup/dibuka
watch(() => props.show, (newVal) => {
  if (newVal) {
    exportFilters.class_id = "";
    exportFilters.month = "";
    exportFilters.year = new Date().getFullYear().toString();
    exportFilters.status = "";
  }
});

const executeExport = async () => {
  try {
    emit('close'); // Tutup modal di parent dulu
    
    Swal.fire({
      title: 'Menyiapkan Laporan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const response = await Api.get('/admin/bills/export/csv', {
      params: exportFilters,
      responseType: 'blob' 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Tagihan_${new Date().toISOString().slice(0, 10)}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    Swal.close();
  } catch (error) {
    console.error('Export gagal:', error);
    Swal.fire("Gagal", "Terjadi kesalahan saat mengunduh laporan", "error");
  }
};
</script>

<template>
  <div v-if="show" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">Export Laporan Tagihan</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Filter Kelas</label>
                <select v-model="exportFilters.class_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Semua Kelas</option>
                  <option v-for="cls in classrooms" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Filter Status</label>
                <select v-model="exportFilters.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Semua Status</option>
                  <option value="paid">Lunas</option>
                  <option value="partial">Dicicil</option>
                  <option value="pending">Belum Lunas (Tunggakan)</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Bulan</label>
                  <select v-model="exportFilters.month" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="">Semua Bulan</option>
                    <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tahun</label>
                  <input v-model="exportFilters.year" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="executeExport" type="button" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Unduh CSV</button>
            <button @click="emit('close')" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>