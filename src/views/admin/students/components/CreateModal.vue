<script setup>
import { reactive, watch, ref } from "vue";
import Api from "../../../../api/axios";
import Swal from "sweetalert2";

const props = defineProps({
  show: Boolean,
  classrooms: Array, 
  isLoading: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  nis: "",
  name: "",
  class_id: "", 
  parent_name: "",
  phone_number: "",
  address: "",
  password: "",
});

watch(() => props.show, (val) => {
  if(!val) {
    // Reset form when modal closes
    form.nis = "";
    form.name = "";
    form.class_id = "";
    form.parent_name = "";
    form.phone_number = "";
    form.address = "";
    form.password = "";
  }
});

const submit = () => {
  if (!form.nis || !form.name || !form.class_id || !form.parent_name || !form.phone_number || !form.address || !form.password) {
    Swal.fire({
      icon: "warning",
      title: "Data Tidak Lengkap",
      text: "Harap lengkapi semua field yang wajib diisi!",
      confirmButtonColor: "#4f46e5",
    });
    return;
  }
  emit("submit", form);
};
</script>

<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 border border-gray-100">
          
          <h3 class="text-xl font-bold leading-6 text-gray-900 mb-5 border-b pb-3">Tambah Siswa Baru</h3>
          
          <div class="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-semibold text-gray-700">NIS / NISN</label>
              <input v-model="form.nis" type="text" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50" placeholder="Contoh: 10112233">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input v-model="form.name" type="text" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50" placeholder="Nama Siswa">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Kelas</label>
              <select v-model="form.class_id" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50">
                <option value="" disabled>-- Pilih Kelas --</option>
                <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                  {{ classroom.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Password Akun</label>
              <input v-model="form.password" type="password" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50" placeholder="Min. 8 Karakter">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Nama Orang Tua / Wali</label>
              <input v-model="form.parent_name" type="text" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">No. WhatsApp</label>
              <input v-model="form.phone_number" type="tel" inputmode="numeric" pattern="[0-9]*" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50" placeholder="08...">
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
              <textarea v-model="form.address" rows="3" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50"></textarea>
            </div>
          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3 border-t pt-4">
            <button @click="submit" :disabled="isLoading" class="inline-flex w-full sm:w-auto justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-95">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isLoading ? 'Menyimpan...' : 'Simpan Siswa' }}
            </button>
            <button @click="$emit('close')" :disabled="isLoading" class="mt-3 sm:mt-0 inline-flex w-full sm:w-auto justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
              Batal
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
