<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isLoading = ref(false);
const activeRole = ref(route.query.role === 'admin' ? 'admin' : 'student'); // Default role: Orang Tua

const themeClasses = computed(() => {
  return activeRole.value === 'admin' 
    ? 'bg-slate-100' 
    : 'bg-gray-100';
});
const buttonTheme = computed(() => {
  return activeRole.value === 'admin'
    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
});


const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  isLoading.value = true;

  try {
    const user = await authStore.login(form.email, form.password);

    await Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang kembali, ${user?.name || "User"}`,
      timer: 1500,
      showConfirmButton: false,
    });

    if (user.role === "admin") {
      router.push({ name: "admin.dashboard" });
    } else {
      router.push({ name: "student.dashboard" });
    }
  } catch (error) {
    console.error("DEBUG ERROR API MENTAH:", error.response || error);

    let errorTitle = "Gagal Login";
    let errorMessage = "Terjadi kesalahan pada sistem.";

    if (error.response) {
      const status = parseInt(error.response.status, 10);
      const data = error.response.data;

      const serverMessage = data?.message || data?.error || data?.status || "";

      if (status === 401) {
        errorMessage = serverMessage || "Email atau password yang Anda masukkan salah.";
      } else if (status === 422) {
        errorTitle = "Validasi Gagal";
        if (data?.errors && typeof data.errors === 'object') {
          errorMessage = Object.values(data.errors).flat().join("<br>");
        } else {
          errorMessage = serverMessage || "Data yang dikirim tidak lengkap.";
        }
      } else if (status === 404) {
        errorMessage = "Endpoint API tidak ditemukan di server. Cek rute Laravel Anda.";
      } else if (status >= 500) {
        errorMessage = "Terjadi kerusakan di dalam server (Error 500).";
      } else {
        errorMessage = serverMessage || `Terjadi Error Kode: ${status}`;
      }
    } else if (error.request) {
      errorMessage = "Server tidak merespon. Cek koneksi internet atau VPS mati.";
    } else {
      errorMessage = error.message || "Aplikasi frontend mengalami error internal.";
    }
        if (!errorMessage || errorMessage === "undefined") {
        errorMessage = "Gagal mengekstrak pesan error. Silakan cek console F12.";
    }

    await Swal.fire({
      icon: "error",
      title: errorTitle,
      html: errorMessage,
      confirmButtonColor: "#4f46e5",
    });
  } finally {
    isLoading.value = false;
  }
};

</script>

<template>
  <div
    :class="['min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-all duration-700', themeClasses]"
  >

    <div class="absolute top-0 left-0 w-full z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-md bg-white p-1 overflow-hidden shadow-sm">
              <img src="/logo.png" alt="Logo Sekolah" class="w-full h-full object-contain" />
            </div>
            <span class="text-xl font-extrabold text-slate-800 tracking-tight hidden sm:block">RA Darul Fikri</span>
          </div>

          <router-link
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            &larr; Kembali ke Beranda
          </router-link>
        </div>
      </div>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10 mt-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 transition-all duration-300">
        {{ activeRole === 'admin' ? 'Login Tata Usaha' : 'Login Orang Tua' }}
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        {{ activeRole === 'admin' ? 'Kelola data dan administrasi sekolah.' : 'Pantau tagihan dan lakukan pembayaran.' }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative">


      <div
        class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200"
      >
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              :class="['w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200', buttonTheme]"
            >
              {{ isLoading ? "Memproses..." : "Masuk Sekarang" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
