<script setup>
import { ref, watch, computed } from "vue";
import Api from "../../../../api/axios"; // Sesuaikan path axios lu
import Swal from "sweetalert2";

const props = defineProps({
  show: Boolean,
  bill: Object
});

const emit = defineEmits(["close", "submit", "refresh"]);

const isLoading = ref(false);
const isCanceling = ref(false);
const detailBill = ref(null); 
const amount = ref(null);
const notes = ref("");

const formatRupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

// Hitung dinamis sisa tagihan
const sisaTagihan = computed(() => {
  if (!detailBill.value) return 0;
  return detailBill.value.amount - detailBill.value.paid_amount;
});

// Ambil detail tagihan + history transaksi saat modal dibuka
const fetchBillDetail = async () => {
  if (!props.bill?.id) return;
  isLoading.value = true;
  try {
    const response = await Api.get(`/admin/bills/${props.bill.id}`);
    detailBill.value = response.data.data;
  } catch (error) {
    console.error("Gagal load detail:", error);
  } finally {
    isLoading.value = false;
  }
};

// Pantau perubahan props.show
watch(() => props.show, (newVal) => {
  if (newVal) {
    amount.value = null;
    notes.value = "";
    fetchBillDetail();
  } else {
    detailBill.value = null; 
  }
});

const handleBayar = () => {
  if (!amount.value || amount.value < 1000) {
    return Swal.fire("Error", "Nominal minimal Rp 1.000", "error");
  }
  if (amount.value > sisaTagihan.value) {
    return Swal.fire("Error", "Nominal melebihi sisa tagihan", "error");
  }
  
  emit("submit", {
    bill_id: detailBill.value.id,
    amount: amount.value,
    notes: notes.value
  });
};

// FUNGSI DOWNLOAD PDF
const downloadReceipt = async (transaction) => {
  try {
    Swal.fire({
      title: 'Menyiapkan Kwitansi...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const response = await Api.get(`/admin/transactions/${transaction.id}/receipt`, {
      responseType: 'blob' // Wajib agar axios menerima file fisik
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kwitansi_${transaction.invoice_number}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    Swal.close();
  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', 'Tidak dapat mengunduh kwitansi PDF.', 'error');
  }
};

// FUNGSI PEMBATALAN TRANSAKSI
const batalkanTransaksi = async (transactionId) => {
  Swal.fire({
    title: "Batalkan Cicilan?",
    text: "Uang yang sudah masuk akan ditarik kembali.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
  }).then(async (result) => {
    if (result.isConfirmed) {
      isCanceling.value = true;
      try {
        await Api.delete(`/admin/transactions/${transactionId}`);
        Swal.fire("Berhasil", "Cicilan dibatalkan.", "success");
        await fetchBillDetail();
        emit("refresh"); 
      } catch (error) {
        Swal.fire("Gagal", error.response?.data?.message || "Gagal membatalkan", "error");
      } finally {
        isCanceling.value = false;
      }
    }
  });
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      
      <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          
          <div v-if="isLoading" class="text-center py-10">Memuat detail data...</div>

          <div v-else-if="detailBill">
            <h3 class="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">
              Detail & Pembayaran: {{ detailBill.student?.user?.name }}
            </h3>

            <div class="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-md">
              <div>
                <p class="text-xs text-gray-500 uppercase">Total Tagihan</p>
                <p class="font-bold text-gray-900">{{ formatRupiah(detailBill.amount) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase">Sisa yang harus dibayar</p>
                <p class="font-bold text-red-600 text-lg">{{ formatRupiah(sisaTagihan) }}</p>
              </div>
            </div>

            <form v-if="sisaTagihan > 0" @submit.prevent="handleBayar" class="mb-8 p-4 border rounded-md border-indigo-100 bg-indigo-50/30">
              <h4 class="font-semibold text-sm mb-3">Input Cicilan Baru</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700">Nominal (Rp)</label>
                  <input v-model.number="amount" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Cth: 50000" required>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700">Catatan (Opsional)</label>
                  <input v-model="notes" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Cth: Titipan Ibu">
                </div>
              </div>
              <button type="submit" class="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-bold text-sm">
                Bayar Sekarang
              </button>
            </form>

            <div v-else class="mb-8 p-4 bg-green-100 text-green-800 text-center font-bold rounded-md">
              TAGIHAN INI SUDAH LUNAS
            </div>

            <h4 class="font-semibold text-sm mb-2">Riwayat Pembayaran</h4>
            <div class="overflow-x-auto border rounded-md">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Tanggal</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Nominal</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Catatan</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="trx in detailBill.transactions" :key="trx.id">
                    <td class="px-4 py-2">{{ new Date(trx.created_at).toLocaleDateString('id-ID') }}</td>
                    <td class="px-4 py-2 font-semibold text-green-600">{{ formatRupiah(trx.amount) }}</td>
                    <td class="px-4 py-2 text-xs text-gray-500">{{ trx.description || '-' }}</td>
                    <td class="px-4 py-2 text-center">
                      <div class="flex justify-center gap-2">
                        <button @click="downloadReceipt(trx)" type="button" class="text-xs text-indigo-600 hover:text-indigo-900 border border-indigo-200 px-2 py-1 rounded bg-indigo-50 font-semibold">
                          🖨️ Cetak PDF
                        </button>
                        
                        <button @click="batalkanTransaksi(trx.id)" :disabled="isCanceling" type="button" class="text-xs text-red-600 hover:text-red-900 border border-red-200 px-2 py-1 rounded bg-red-50 disabled:opacity-50 font-semibold">
                          Batalkan
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!detailBill.transactions || detailBill.transactions.length === 0">
                    <td colspan="4" class="px-4 py-2 text-center text-gray-500 text-xs">Belum ada cicilan masuk.</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>