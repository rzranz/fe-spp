<script setup>
import { reactive, watch, ref, computed } from "vue";

const props = defineProps({
  show: Boolean,
  fees: Array,
  students: Array,
  classrooms: Array, 
  isLoading: Boolean,
  months: Array
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  fee_id: "",
  month: "Januari",
  year: new Date().getFullYear().toString(),
  amount: "",
  target_type: "all",
  student_ids: []
});

const searchStudent = ref("");
const filterClass = ref("");

const handleFeeChange = () => {
  const selectedFee = props.fees.find(f => f.id == form.fee_id);
  if (selectedFee) form.amount = selectedFee.amount;
};

watch(() => props.show, (val) => {
  if(!val) {
    form.fee_id = "";
    form.amount = "";
    form.target_type = "all";
    form.student_ids = [];
    searchStudent.value = ""; 
    filterClass.value = "";   
  }
});

const filteredStudents = computed(() => {
  if (!props.students) return [];

  return props.students.filter(student => {
    // 1. Logika pencarian text (Nama & NIS)
    const matchName = 
      (student.user?.name || "").toLowerCase().includes(searchStudent.value.toLowerCase()) ||
      (student.nis || "").toLowerCase().includes(searchStudent.value.toLowerCase());
    
    // 2. Logika pencarian dropdown kelas
    const matchClass = filterClass.value === "" ? true : student.class_id === filterClass.value;

    return matchName && matchClass;
  });
});

const submit = () => {
  if (!form.fee_id || !form.amount) {
    alert("Pilih jenis tagihan terlebih dahulu!");
    return;
  }
  if (form.target_type === 'specific' && form.student_ids.length === 0) {
    alert("Pilih minimal satu siswa untuk digenerate!");
    return;
  }

  const payload = {
    fee_id: form.fee_id,
    month: form.month,
    year: form.year,
    amount: form.amount,
    student_ids: form.target_type === 'specific' ? form.student_ids : []
  };

  emit("submit", payload);
};
</script>

<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6 border border-gray-100">
          
          <h3 class="text-xl font-bold leading-6 text-gray-900 mb-5 border-b pb-3">Generate Tagihan Baru</h3>
          
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700">Jenis Tagihan</label>
              <select v-model="form.fee_id" @change="handleFeeChange" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50">
                <option value="" disabled>-- Pilih Biaya --</option>
                <option v-for="fee in fees" :key="fee.id" :value="fee.id">
                  {{ fee.name }} - Rp {{ new Intl.NumberFormat("id-ID").format(fee.amount) }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                  <label class="block text-sm font-semibold text-gray-700">Bulan</label>
                  <select v-model="form.month" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50">
                    <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                  </select>
              </div>
              <div>
                  <label class="block text-sm font-semibold text-gray-700">Tahun</label>
                  <input v-model="form.year" type="number" class="mt-1.5 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50">
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Nominal (Rp)</label>
              <input v-model="form.amount" type="number" class="mt-1.5 block w-full rounded-lg border-gray-200 py-2.5 px-3 shadow-sm text-sm bg-gray-100 font-bold text-gray-600 cursor-not-allowed" readonly>
            </div>

            <div class="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
              <label class="block text-sm font-semibold text-indigo-900 mb-3">Target Penerima Tagihan</label>
              
              <div class="flex items-center gap-6 mb-3">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="radio" name="target_type" v-model="form.target_type" value="all" class="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 cursor-pointer">
                  Semua Siswa Aktif
                </label>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="radio" name="target_type" v-model="form.target_type" value="specific" class="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 cursor-pointer">
                  Pilih Siswa Tertentu
                </label>
              </div>

              <div v-if="form.target_type === 'specific'" class="mt-4 border-t border-indigo-100 pt-3">
                
                <div class="flex flex-col sm:flex-row gap-2 mb-3">
                  <input 
                    v-model="searchStudent" 
                    type="text" 
                    placeholder="Cari nama / NIS..." 
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                  <select 
                    v-model="filterClass" 
                    class="block w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Semua Kelas</option>
                    <option v-for="cls in classrooms" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
                  </select>
                </div>

                <div class="bg-white border border-gray-200 rounded-md p-2 h-48 overflow-y-auto shadow-inner">
                  <div v-if="filteredStudents.length === 0" class="text-xs text-gray-500 text-center py-6">
                    Tidak ada siswa yang cocok dengan pencarian/filter.
                  </div>
                  
                  <div class="space-y-1">
                    <label v-for="student in filteredStudents" :key="student.id" class="flex items-center justify-between gap-3 p-2 hover:bg-indigo-50 rounded-md cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                      <div class="flex items-center gap-3 overflow-hidden">
                        <input type="checkbox" :value="student.id" v-model="form.student_ids" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mt-0.5 shrink-0">
                        <div class="flex flex-col truncate">
                          <span class="text-sm font-bold text-gray-800 truncate">{{ student.user?.name || 'Nama Tidak Valid' }}</span>
                          <span class="text-xs text-gray-500">NIS: {{ student.nis || '-' }}</span>
                        </div>
                      </div>
                      <span class="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-md shrink-0 border border-gray-200">
                        {{ student.classroom?.name || 'Tanpa Kelas' }}
                      </span>
                    </label>
                  </div>
                </div>
                
                <div class="mt-2 text-xs font-medium text-indigo-700 bg-indigo-100/50 inline-block px-2 py-1 rounded">
                  Terpilih: {{ form.student_ids.length }} siswa
                </div>

              </div>
            </div>

          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3 border-t pt-4">
            <button @click="submit" :disabled="isLoading" class="inline-flex w-full sm:w-auto justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-95">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isLoading ? 'Memproses...' : 'Generate Tagihan' }}
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