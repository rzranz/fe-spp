<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Api from "../../../api/axios"; // Sesuaikan path
import Swal from "sweetalert2";

const router = useRouter();
const isLoading = ref(false);
const classrooms = ref([]); // Tempat nyimpen data kelas

// Form State
const form = reactive({
  nis: "",
  name: "",
  class_id: "", // Wajib string kosong dulu
  parent_name: "",
  phone_number: "",
  address: "",
  password: "",
});

// 1. AMBIL DATA KELAS (Ini yang tadi error)
const fetchClassrooms = async () => {
  try {
    // PERBAIKAN: Gunakan endpoint baru '/admin/classrooms'
    const response = await Api.get("/admin/classrooms");

    classrooms.value = response.data.data;
  } catch (error) {
    console.error("Gagal load kelas:", error);
    Swal.fire("Error", "Gagal memuat data kelas.", "error");
  }
};

// 2. SIMPAN SISWA
const storeStudent = async () => {
  isLoading.value = true;
  try {
    // Validasi Password (Opsional, tapi backend minta min 8)
    if (!form.password || form.password.length < 8) {
      Swal.fire(
        "Validasi",
        "Password wajib diisi minimal 8 karakter",
        "warning",
      );
      isLoading.value = false;
      return;
    }

    await Api.post("/admin/students", form);

    Swal.fire("Berhasil", "Data siswa berhasil disimpan!", "success");
    router.push({ name: "students.index" }); // Redirect ke list siswa
  } catch (error) {
    // Tangkap error validasi dari Laravel
    const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";

    // Jika ada error detail per kolom
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      let errorList = "";
      for (const key in errors) {
        errorList += `${errors[key][0]}<br>`;
      }
      Swal.fire("Gagal", errorList, "error");
    } else {
      Swal.fire("Gagal", msg, "error");
    }
  } finally {
    isLoading.value = false;
  }
};

// Load kelas saat halaman dibuka
onMounted(() => {
  fetchClassrooms();
});
</script>

<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="bg-white shadow sm:rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Tambah Siswa Baru
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Lengkapi data di bawah ini.
        </p>
      </div>

      <div class="p-6 space-y-6">
        <form @submit.prevent="storeStudent">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >NIS / NISN</label
              >
              <input
                v-model="form.nis"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Contoh: 10112233"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Nama Lengkap</label
              >
              <input
                v-model="form.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Nama Siswa"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Kelas</label
              >
              <select
                v-model="form.class_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                required
              >
                <option value="" disabled selected>-- Pilih Kelas --</option>
                <option
                  v-for="classroom in classrooms"
                  :key="classroom.id"
                  :value="classroom.id"
                >
                  {{ classroom.name }}
                </option>
              </select>
              <p
                v-if="classrooms.length === 0"
                class="text-xs text-red-500 mt-1"
              >
                *Data kelas kosong. Harap input data kelas dulu.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Password Akun</label
              >
              <input
                v-model="form.password"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Min. 8 Karakter"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Nama Orang Tua / Wali</label
              >
              <input
                v-model="form.parent_name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >No. WhatsApp</label
              >
              <input
                v-model="form.phone_number"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="08..."
                required
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700"
                >Alamat Lengkap</label
              >
              <textarea
                v-model="form.address"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                required
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <router-link
              :to="{ name: 'students.index' }"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Batal
            </router-link>
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {{ isLoading ? "Menyimpan..." : "Simpan Siswa" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
