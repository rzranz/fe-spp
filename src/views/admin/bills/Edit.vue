<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import Api from "../../../api/axios";

const route = useRoute();
const router = useRouter();
const studentId = route.params.id;

const isLoading = ref(false);
const showPassword = ref(false);
const classrooms = ref([]);

const form = ref({
  nis: "",
  name: "",
  class_id: "",
  password: "", 
  parent_name: "",
  phone_number: "",
  address: "",
});

// 1. Ambil Data Kelas untuk Dropdown
const fetchClassrooms = async () => {
  try {
    const response = await Api.get("/classrooms");
    classrooms.value = response.data.data;
  } catch (error) {
    console.error("Gagal load kelas", error);
  }
};

// 2. Ambil Data Siswa yang mau diedit
const fetchStudentData = async () => {
  try {
    isLoading.value = true;
    // GET /api/admin/students/{id}
    const response = await Api.get(`/admin/students/${studentId}`);
    const data = response.data.data;
    form.value = {
      nis: data.nis || data.nisn, // Handle beda nama kolom
      name: data.name || (data.user ? data.user.name : ''),
      class_id: data.class_id || (data.classroom ? data.classroom.id : ''),
      password: "", // Password dikosongkan (security)
      parent_name: data.parent_name,
      phone_number: data.phone_number,
      address: data.address,
    };
  } catch (error) {
    Swal.fire("Error", "Gagal mengambil data siswa.", "error");
    router.push({ name: "students.index" });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchClassrooms();
  fetchStudentData();
});

// 3. Update Data
const handleUpdate = async () => {
  isLoading.value = true;
  try {
    // PUT /api/admin/students/{id}
    await Api.put(`/admin/students/${studentId}`, form.value);

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data siswa berhasil diperbarui.",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => router.push({ name: "students.index" }));
    
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: error.response?.data?.message || "Terjadi kesalahan sistem.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Edit Data Siswa</h2>
      <RouterLink
        :to="{ name: 'students.index' }"
        class="text-gray-500 hover:text-gray-700 text-sm"
      >
        &larr; Kembali
      </RouterLink>
    </div>

    <div class="bg-white shadow sm:rounded-lg p-6">
      <form @submit.prevent="handleUpdate" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">NIS</label>
          <input
            v-model="form.nis"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Lengkap Siswa</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Kelas</label>
          <select
            v-model="form.class_id"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>-- Pilih Kelas --</option>
            <option v-for="cls in classrooms" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password Baru <span class="text-gray-400 text-xs">(Opsional)</span></label>
          <div class="relative mt-1">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Isi hanya jika ingin mengubah password"
              class="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400"
            >
              {{ showPassword ? "Sembunyikan" : "Lihat" }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Orang Tua/Wali</label>
          <input
            v-model="form.parent_name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
          <input
            v-model="form.phone_number"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
          <textarea
            v-model="form.address"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>

        <div class="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-sm transition"
          >
            {{ isLoading ? "Menyimpan..." : "Update Data Siswa" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>