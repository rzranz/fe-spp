<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Api from "../../api/axios"; 
import Swal from "sweetalert2";

const router = useRouter();
const isLoading = ref(false);

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

    const token = response.data.token;
    const user = response.data.user;

    if (!token || !user) {
      throw new Error("Respon server tidak valid (Token/User hilang).");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: `Selamat datang, ${user.name}`,
      timer: 1500,
      showConfirmButton: false,
    });

    if (user.role === "admin") {
      router.push({ name: "admin.dashboard" });
    } else if (user.role === "student") {
      router.push({ name: "student.dashboard" });
    } else {
      Swal.fire("Error", "Role user tidak dikenali.", "error");
      localStorage.clear();
    }
  } catch (error) {
    console.error("Login Error Asli:", error); 

    let message = "Terjadi kesalahan yang tidak diketahui.";


    if (error.response) {
    
      message = error.response.data?.message || `Server Error: ${error.response.status}`;
    } else if (error.request) {
      
      message = "Gagal terhubung ke Server API. Cek koneksi atau konfigurasi CORS Anda.";
    } else {
    
      message = "Error Internal Aplikasi: " + error.message;
    }

    Swal.fire({
      icon: "error",
      title: "Gagal Login",
      text: message,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
  >
    <div
      class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20"
    >
      <div class="flex items-center gap-3">
        <div class="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.813m-15.482 0A50.55 50.55 0 0112 13.489a50.55 50.55 0 0112-4.178"
            />
          </svg>
        </div>
        <span
          class="text-xl font-bold text-slate-800 tracking-tight hidden sm:block"
          >SPP Darul Fikri</span
        >
      </div>

      <router-link
        to="/"
        class="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 font-medium rounded-full shadow-sm hover:shadow-md hover:text-indigo-600 transition-all duration-200 border border-slate-200"
      >
        <span
          class="group-hover:-translate-x-1 transition-transform duration-200"
          >&larr;</span
        >
        Kembali ke Beranda
      </router-link>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10 mt-10">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
        Masuk ke Aplikasi
      </h2>
      <p class="mt-2 text-center text-sm text-slate-600">
        Silakan login untuk mengakses data pembayaran
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
      <div
        class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100"
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
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? "Memproses..." : "Masuk Sekarang" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
