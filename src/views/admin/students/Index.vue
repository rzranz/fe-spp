<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import Api from "../../../api/axios";

// Import Components
import StudentTable from "./components/StudentTable.vue";
import Pagination from "../../../components/Pagination.vue";
import CreateModal from "./components/CreateModal.vue";
import ImportModal from "./components/ImportModal.vue";

const students = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const currentPage = ref(1);
const lastPage = ref(1);

const showCreateModal = ref(false);
const showImportModal = ref(false);
const isSubmitting = ref(false);
const classrooms = ref([]);

let searchTimeout;

const fetchStudents = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await Api.get("/admin/students", {
      params: { page: page, q: searchQuery.value }
    });

    students.value = response.data.data;
    currentPage.value = response.data.meta.current_page;
    lastPage.value = response.data.meta.last_page;
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchStudents(1);
  }, 500);
};

const fetchClassrooms = async () => {
  try {
    const response = await Api.get("/admin/classrooms");
    classrooms.value = response.data.data;
  } catch (error) {
    console.error("Gagal memuat kelas:", error);
  }
};

const submitCreate = async (formData) => {
  isSubmitting.value = true;
  try {
    await Api.post("/admin/students", formData);
    Swal.fire("Berhasil", "Data siswa berhasil disimpan!", "success");
    showCreateModal.value = false;
    fetchStudents(currentPage.value);
  } catch (error) {
    const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";
    Swal.fire("Gagal", msg, "error");
  } finally {
    isSubmitting.value = false;
  }
};

const submitImport = async (file) => {
  isSubmitting.value = true;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await Api.post("/admin/students/import", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    if (response.data.error_count > 0) {
      let errorMsg = response.data.errors.join("<br>");
      Swal.fire({
        title: "Import Selesai dengan Catatan",
        html: `Berhasil: ${response.data.success_count} baris<br>Gagal: ${response.data.error_count} baris<br><br><div class="text-left text-sm h-32 overflow-y-auto bg-red-50 p-2 rounded text-red-700">${errorMsg}</div>`,
        icon: "warning",
      });
    } else {
      Swal.fire("Berhasil", response.data.message || "Data siswa berhasil diimport!", "success");
    }
    
    showImportModal.value = false;
    fetchStudents(currentPage.value);
  } catch (error) {
    const msg = error.response?.data?.message || "Terjadi kesalahan saat import.";
    Swal.fire("Gagal", msg, "error");
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = (id, name) => {
  Swal.fire({
    title: "Hapus Data?",
    text: `Anda yakin ingin menghapus "${name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Ya, Hapus!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await Api.delete(`/admin/students/${id}`);
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
        fetchStudents(currentPage.value); 
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  });
};

onMounted(() => {
  fetchStudents();
  fetchClassrooms();
});
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Data Siswa</h2>
        <p class="mt-1 text-sm text-gray-500">Daftar seluruh siswa aktif dan alumni Darul Fikri.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex sm:gap-3">
        <button @click="showImportModal = true" class="block w-full sm:w-auto rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mb-3 sm:mb-0">
          Import CSV
        </button>
        <button @click="showCreateModal = true" class="block w-full sm:w-auto rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          + Tambah Siswa
        </button>
      </div>
    </div>

    <div class="flex justify-end">
      <div class="w-full sm:max-w-xs relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="search" 
          class="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
          placeholder="Cari Nama atau NIS..." 
        >
      </div>
    </div>

    <StudentTable 
      :students="students" 
      :isLoading="isLoading" 
      @delete="handleDelete" 
    />

    <Pagination 
      :currentPage="currentPage" 
      :lastPage="lastPage" 
      @changePage="fetchStudents" 
    />

    <CreateModal
      :show="showCreateModal"
      :classrooms="classrooms"
      :isLoading="isSubmitting"
      @close="showCreateModal = false"
      @submit="submitCreate"
    />

    <ImportModal
      :show="showImportModal"
      :isLoading="isSubmitting"
      @close="showImportModal = false"
      @submit="submitImport"
    />
  </div>
</template>