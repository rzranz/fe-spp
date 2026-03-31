<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isLoggedIn = ref(false);
const userRole = ref("");

// Fungsi Cek Login Sederhana
const checkAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Kalau ada token, berarti login
  isLoggedIn.value = !!token;
  userRole.value = user.role || "";
};

// Cek saat pertama load
onMounted(() => {
  checkAuth();
});

// Cek lagi setiap user pindah halaman (PENTING!)
watch(route, () => {
  checkAuth();
});
</script>

<template>
  <nav
    class="border-b border-gray-200 sticky top-0 z-50"
    style="background-color: #ffffff"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <RouterLink
            to="/"
            class="text-2xl font-bold text-indigo-600 no-underline"
          >
            Darul Fikri
          </RouterLink>

          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <RouterLink
              to="/"
              class="text-gray-900 px-3 py-2 text-sm font-medium hover:text-indigo-600"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="text-gray-900 px-3 py-2 text-sm font-medium hover:text-indigo-600"
            >
              About
            </RouterLink>
          </div>
        </div>

        <div class="flex items-center">
          <template v-if="!isLoggedIn">
            <RouterLink
              to="/login"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Login Masuk
            </RouterLink>
          </template>

          <template v-else>
            <RouterLink
              :to="
                userRole === 'admin' ? 'admin/dashboard' : '/dashboard/student'
              "
              class="ml-3 inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Ke Dashboard
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
