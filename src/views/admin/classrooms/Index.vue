<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import Api from "../../../api/axios";

// Import Components
import ClassroomTable from "./components/ClassroomTable.vue";
import StudentListModal from "./components/StudentListModal.vue";

const classrooms = ref([]);
const isLoading = ref(true);

// Modal State
const showStudentModal = ref(false);
const selectedClassroom = ref(null);

const fetchClassrooms = async () => {
  try {
    isLoading.value = true;
    const response = await Api.get("/admin/classrooms");
    classrooms.value = response.data.data || response.data;
  } catch (error) {
    console.error("Gagal load data kelas:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleCreate = async () => {
  const { value: className } = await Swal.fire({
    title: "Tambah Kelas Baru",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Simpan",
    inputValidator: (value) => value ? null : "Nama kelas tidak boleh kosong!"
  });

  if (className) {
    try {
      await Api.post("/admin/classrooms", { name: className });
      Swal.fire("Berhasil!", "Kelas baru ditambahkan.", "success");
      fetchClassrooms();
    } catch (error) { Swal.fire("Gagal", "Terjadi kesalahan", "error"); }
  }
};

const handleEdit = async (id, oldName) => {
  const { value: newName } = await Swal.fire({
    title: "Edit Nama Kelas",
    input: "text",
    inputValue: oldName,
    showCancelButton: true,
    confirmButtonText: "Update",
    inputValidator: (value) => value ? null : "Nama kelas tidak boleh kosong!"
  });

  if (newName && newName !== oldName) {
    try {
      await Api.put(`/admin/classrooms/${id}`, { name: newName });
      Swal.fire("Berhasil!", "Nama diperbarui.", "success");
      fetchClassrooms();
    } catch (error) { Swal.fire("Gagal", "Terjadi kesalahan", "error"); }
  }
};

const handleDelete = async (id, name) => {
  const result = await Swal.fire({
    title: "Hapus Kelas?",
    html: `Hapus <b>${name}</b>?<br><br><span class="text-red-500 text-sm">Jika masih ada siswa, proses gagal.</span>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Ya, Hapus!"
  });

  if (result.isConfirmed) {
    try {
      await Api.delete(`/admin/classrooms/${id}`);
      Swal.fire("Terhapus!", "Kelas dihapus.", "success");
      fetchClassrooms();
    } catch (error) {
      Swal.fire("Gagal Menghapus", error.response?.data?.message || "Kelas masih memiliki siswa.", "error");
    }
  }
};

const openStudentModal = (id, name) => {
  selectedClassroom.value = { id, name };
  showStudentModal.value = true;
};

onMounted(() => fetchClassrooms());
</script>

<template>
  <div class="space-y-6">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Master Data Kelas</h2>
        <p class="mt-1 text-sm text-gray-500">Kelola daftar kelas dan mutasi siswa.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="handleCreate" class="block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          + Tambah Kelas
        </button>
      </div>
    </div>

    <ClassroomTable 
      :classrooms="classrooms" 
      :isLoading="isLoading" 
      @view="openStudentModal" 
      @edit="handleEdit" 
      @delete="handleDelete" 
    />

    <StudentListModal 
      :show="showStudentModal" 
      :classroom="selectedClassroom" 
      :allClassrooms="classrooms" 
      @close="showStudentModal = false" 
    />
  </div>
</template>