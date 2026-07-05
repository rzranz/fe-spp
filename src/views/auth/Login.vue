<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Api from "../../api/axios"; 
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const activeRole = ref(route.query.role === 'admin' ? 'admin' : 'student'); // Default role: Orang Tua

const themeClasses = computed(() => {
  return activeRole.value === 'admin' 
    ? 'from-blue-50 via-slate-50 to-blue-200' 
    : 'from-indigo-50 via-slate-50 to-slate-200';
});
const buttonTheme = computed(() => {
  return activeRole.value === 'admin'
    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
});
const blobTheme1 = computed(() => activeRole.value === 'admin' ? 'bg-blue-200' : 'bg-indigo-200');
const blobTheme2 = computed(() => activeRole.value === 'admin' ? 'bg-cyan-200' : 'bg-purple-200');
const blobTheme3 = computed(() => activeRole.value === 'admin' ? 'bg-teal-200' : 'bg-pink-200');

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async () => {
  isLoading.value = true;

  try {
    const response = await Api.post("/login", {
      email: form.email,
      password: form.password,
    });

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token || !user) {
      throw new Error("Respon server tidak valid (Token/User hilang).");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
      // PAKSA JADI ANGKA: Menghindari bug "422" (String) === 422 (Number)
      const status = parseInt(error.response.status, 10);
      const data = error.response.data;

      const serverMessage = data?.message || data?.error || data?.status || "";

      if (status === 401) {
        errorMessage = serverMessage || "Email atau password yang Anda masukkan salah.";
      } else if (status === 422) {
        errorTitle = "Validasi Gagal";
        if (data?.errors && typeof data.errors === 'object') {
          // Ekstrak semua pesan error dari objek validasi Laravel
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
    :class="['min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br transition-all duration-700', themeClasses]"
  >
    <!-- Background Decor -->
    <div :class="['absolute -top-24 -left-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob transition-colors duration-700', blobTheme1]"></div>
    <div :class="['absolute top-1/4 -right-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 transition-colors duration-700', blobTheme2]"></div>
    <div :class="['absolute -bottom-24 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 transition-colors duration-700', blobTheme3]"></div>

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
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/60 transition-colors"
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
        class="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-white/50"
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
                class="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all duration-200 bg-white/50"
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
                class="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm transition-all duration-200 bg-white/50"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              :class="['w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0', buttonTheme]"
            >
              {{ isLoading ? "Memproses..." : "Masuk Sekarang" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
