<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  show: Boolean,
  bill: Object, // Data tagihan yang mau diedit
  months: Array,
  isLoading: Boolean
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  month: "",
  year: "",
  amount: "",
});

watch(() => props.show, (val) => {
  if (val && props.bill) {
    form.month = props.bill.month;
    form.year = props.bill.year;
    form.amount = props.bill.amount;
  }
});

const submit = () => {
  if (!form.amount || form.amount <= 0) {
    alert("Nominal tidak boleh kosong atau nol!");
    return;
  }
  emit("submit", { id: props.bill.id, payload: { ...form } });
};
</script>

<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          
          <h3 class="text-lg font-bold leading-6 text-gray-900 mb-2 border-b pb-3">Edit Tagihan Siswa</h3>
          
          <div class="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Nama Siswa</p>
            <p class="text-sm font-bold text-gray-800">{{ bill?.student?.user?.name }}</p>
            <p class="text-xs text-gray-500 mt-1">Jenis Tagihan: <span class="font-medium text-gray-700">{{ bill?.fee?.name || 'Tagihan' }}</span></p>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                  <label class="block text-sm font-semibold text-gray-700">Bulan</label>
                  <select v-model="form.month" class="mt-1 block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                  </select>
              </div>
              <div>
                  <label class="block text-sm font-semibold text-gray-700">Tahun</label>
                  <input v-model="form.year" type="number" class="mt-1 block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Nominal Tagihan (Rp)</label>
              <input v-model="form.amount" type="number" class="mt-1 block w-full rounded-md border-gray-300 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-bold text-gray-900">
              <p class="text-xs text-orange-600 mt-1">*Hanya bisa mengubah nominal tagihan yang belum pernah dicicil/dibayar.</p>
            </div>
          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
            <button @click="submit" :disabled="isLoading" class="inline-flex w-full sm:w-auto justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50">
              {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
            <button @click="$emit('close')" :disabled="isLoading" class="mt-3 sm:mt-0 inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Batal
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>