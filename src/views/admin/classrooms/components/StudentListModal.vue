<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useAdminClassroomStore } from "../../../../stores/admin/classroom";

const props = defineProps({
  show: Boolean,
  classroom: Object, // Berisi { id, name } dari kelas yang diklik
  allClassrooms: Array // Buat opsi dropdown pindah kelas
});

const emit = defineEmits(["close"]);
const classroomStore = useAdminClassroomStore();

const fetchStudents = async () => {
  if (!props.classroom?.id) return;
  try {
    await classroomStore.fetchClassroomStudents(props.classroom.id);
  } catch (error) {
    Swal.fire("Gagal", "Tidak dapat mengambil data siswa di kelas ini.", "error");
    emit("close");
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) fetchStudents();
  else classroomStore.studentsInClass = []; // Reset saat ditutup
});

const moveStudent = async (student) => {
  const classOptions = {};
  props.allClassrooms.forEach((c) => {
    if (c.id !== props.classroom.id) classOptions[c.id] = c.name;
  });

  if (Object.keys(classOptions).length === 0) {
    return Swal.fire("Info", "Tidak ada pilihan kelas lain.", "info");
  }

  const { value: targetClassId } = await Swal.fire({
    title: `Pindahkan ${student.user?.name}?`,
    text: "Pilih kelas tujuan:",
    input: "select",
    inputOptions: classOptions,
    inputPlaceholder: "--- Pilih Kelas Tujuan ---",
    showCancelButton: true,
    confirmButtonText: "Pindahkan",
    inputValidator: (value) => {
      if (!value) return "Anda harus memilih kelas tujuan!";
    }
  });

  if (targetClassId) {
    try {
      await classroomStore.moveStudent(student.id, targetClassId);
      Swal.fire("Berhasil", "Siswa telah dipindahkan.", "success");
      fetchStudents(); // Refresh data di dalam modal
    } catch (error) {
      Swal.fire("Gagal", error.response?.data?.message || "Terjadi kesalahan.", "error");
    }
  }
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 opacity-75" @click="emit('close')"></div>

      <div class="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Daftar Siswa: {{ classroom?.name }}
            </h3>
            <button @click="emit('close')" class="text-gray-400 hover:text-gray-500 font-bold text-xl">&times;</button>
          </div>

          <div v-if="classroomStore.isLoadingStudents" class="text-center py-8 text-gray-500">Memuat daftar siswa...</div>
          
          <div v-else class="overflow-y-auto overflow-x-auto max-h-96 border rounded-md">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">NIS</th>
                  <th class="px-4 py-2 text-left font-medium text-gray-500">Nama Siswa</th>
                  <th class="px-4 py-2 text-center font-medium text-gray-500">Aksi Mutasi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="student in classroomStore.studentsInClass" :key="student.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">{{ student.nis }}</td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ student.user?.name || 'User Dihapus' }}</td>
                  <td class="px-4 py-3 text-center">
                    <button @click="moveStudent(student)" class="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded text-xs font-semibold border border-indigo-200 transition-colors">
                      Pindah Kelas
                    </button>
                  </td>
                </tr>
                <tr v-if="classroomStore.studentsInClass.length === 0">
                  <td colspan="3" class="text-center py-6 text-gray-500 bg-gray-50">Tidak ada siswa terdaftar di kelas ini.</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
