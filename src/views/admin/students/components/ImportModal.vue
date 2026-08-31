<script setup>
import { ref } from "vue";
import Api from "../../../../api/axios"; // Path to axios instance
import Swal from "sweetalert2";

const props = defineProps({
  show: Boolean,
  isLoading: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const file = ref(null);
const fileInput = ref(null);

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    // Basic validation for csv/excel
    if (!selectedFile.name.match(/\.(csv|xls|xlsx)$/i)) {
      Swal.fire({
        icon: "warning",
        title: "Format Tidak Sesuai",
        text: "Harap pilih file Excel atau CSV yang valid.",
        confirmButtonColor: "#4f46e5"
      });
      fileInput.value.value = "";
      file.value = null;
      return;
    }
    file.value = selectedFile;
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile.name.match(/\.(csv|xls|xlsx)$/i)) {
      file.value = droppedFile;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Format Tidak Sesuai",
        text: "Harap pilih file Excel atau CSV yang valid.",
        confirmButtonColor: "#4f46e5"
      });
    }
  }
};

const removeFile = () => {
  file.value = null;
  if(fileInput.value) fileInput.value.value = "";
};

const downloadTemplate = async () => {
  try {
    const response = await Api.get("/admin/students/template", {
      responseType: "blob", 
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_import_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Gagal mendownload template", error);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Gagal mendownload template. Silakan coba lagi.",
      confirmButtonColor: "#4f46e5"
    });
  }
};

const submit = () => {
  if (!file.value) {
    Swal.fire({
      icon: "warning",
      title: "File Kosong",
      text: "Pilih file terlebih dahulu!",
      confirmButtonColor: "#4f46e5"
    });
    return;
  }
  emit("submit", file.value);
};
</script>

<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-gray-100">
          
          <div class="flex items-center justify-between mb-5 border-b pb-3">
            <h3 class="text-xl font-bold leading-6 text-gray-900">Import Data Siswa</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            
            <div class="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h4 class="text-sm font-bold text-indigo-900 mb-1">Langkah 1: Siapkan Data</h4>
              <p class="text-xs text-indigo-700 mb-3">Download template CSV yang telah disesuaikan dengan format sistem. Isi data sesuai kolom yang tersedia.</p>
              <button @click="downloadTemplate" type="button" class="inline-flex items-center text-xs font-semibold bg-white px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-md shadow-sm hover:bg-indigo-50">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Template CSV
              </button>
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-bold text-gray-800 mb-2">Langkah 2: Upload File</h4>
              
              <div 
                class="mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 transition-colors hover:bg-gray-50 bg-white"
                @dragover.prevent
                @drop="handleDrop"
                :class="{'border-indigo-500 bg-indigo-50': file}"
              >
                <div class="text-center" v-if="!file">
                  <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                  </svg>
                  <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" ref="fileInput" @change="handleFileChange" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs leading-5 text-gray-500">CSV atau Excel hingga 5MB</p>
                </div>
                
                <div v-else class="text-center w-full">
                  <div class="flex items-center justify-center mb-2">
                    <svg class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ file.name }}</p>
                  <p class="text-xs text-gray-500">{{ (file.size / 1024).toFixed(2) }} KB</p>
                  <button @click="removeFile" class="mt-3 text-xs font-medium text-red-600 hover:text-red-500">
                    Hapus / Ganti File
                  </button>
                </div>
              </div>
            </div>
            
          </div>

          <div class="mt-6 sm:flex sm:flex-row-reverse sm:gap-3 border-t pt-4">
            <button @click="submit" :disabled="isLoading || !file" class="inline-flex w-full sm:w-auto justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-95">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isLoading ? 'Mengimport...' : 'Import Data' }}
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
