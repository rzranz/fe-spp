<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAdminFeeStore } from '../../../stores/admin/fee';
import Swal from 'sweetalert2';

const feeStore = useAdminFeeStore();
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const form = reactive({
  id: '',
  name: '',
  amount: ''
});

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

const fetchFees = async () => {
  try {
    await feeStore.fetchFees();
  } catch (error) {
    console.error("Gagal menarik data tarif:", error);
  }
};

const openAddModal = () => {
  isEditing.value = false;
  form.id = '';
  form.name = '';
  form.amount = '';
  showModal.value = true;
};

const openEditModal = (fee) => {
  isEditing.value = true;
  form.id = fee.id;
  form.name = fee.name;
  form.amount = fee.amount;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  if (!form.name || !form.amount) {
    return Swal.fire('Peringatan', 'Nama Tagihan dan Nominal wajib diisi!', 'warning');
  }

  isSubmitting.value = true;
  try {
    const payload = { name: form.name, amount: form.amount };
    
    if (isEditing.value) {
      await feeStore.updateFee(form.id, payload);
      Swal.fire('Berhasil', 'Data tagihan berhasil diperbarui.', 'success');
    } else {
      await feeStore.createFee(payload);
      Swal.fire('Berhasil', 'Jenis tagihan baru ditambahkan.', 'success');
    }
    
    closeModal();
    fetchFees(); 
  } catch (error) {
    Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan sistem', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteFee = (id) => {
  Swal.fire({
    title: 'Hapus Jenis Tagihan?',
    text: "Jika tagihan ini sudah dipakai siswa, sistem akan menolak penghapusan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const responseData = await feeStore.deleteFee(id);
        Swal.fire('Terhapus!', responseData.message || 'Data berhasil dihapus.', 'success');
        fetchFees();
      } catch (error) {
        Swal.fire('Ditolak!', error.response?.data?.message || 'Gagal menghapus data.', 'error');
      }
    }
  });
};

onMounted(() => {
  fetchFees();
});
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Master Biaya / Tarif</h2>
        <p class="mt-1 text-sm text-gray-500">Kelola jenis tagihan (SPP, POMG, Gedung) dan nominal default-nya.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0">
        <button @click="openAddModal" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          + Tambah Jenis Tagihan
        </button>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Tagihan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal Default</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="feeStore.isLoading">
            <td colspan="3" class="px-6 py-12 text-center">
              <div class="flex items-center justify-center text-indigo-600">
                <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span class="font-medium">Memuat data...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="feeStore.fees.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">Belum ada data master biaya.</td>
          </tr>
          <tr v-else v-for="fee in feeStore.fees" :key="fee.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ fee.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatRupiah(fee.amount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
              <button @click="openEditModal(fee)" class="text-amber-600 hover:text-amber-900">Edit</button>
              <button @click="deleteFee(fee.id)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="relative z-50">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl transition-all w-full max-w-md">
            <h3 class="text-lg font-bold leading-6 text-gray-900 mb-4">
              {{ isEditing ? 'Edit Tagihan' : 'Tambah Tagihan Baru' }}
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700">Nama Tagihan</label>
                <input v-model="form.name" type="text" placeholder="Contoh: SPP Bulanan" class="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700">Nominal Default (Rp)</label>
                <input v-model="form.amount" type="number" placeholder="Contoh: 150000" class="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button @click="closeModal" type="button" class="rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Batal
              </button>
              <button @click="handleSubmit" :disabled="isSubmitting" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>