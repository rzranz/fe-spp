<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  Swal.fire({
    title: 'Keluar dari Sistem?',
    text: "Anda harus login kembali untuk melihat tagihan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Sedang keluar...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        await authStore.logout();
        
        Swal.close();
        router.push('/login');
      } catch (error) {
        console.error('Logout error', error);
        Swal.close();
        router.push('/login');
      }
    }
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-600 shadow-md">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 overflow-hidden">
              <img src="/logo.png" alt="Logo Sekolah" class="w-full h-full object-contain" />
            </div>
            <span class="text-xl font-bold text-white tracking-wide">RA Darul Fikri</span>
          </div>
          <button @click="handleLogout" class="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 transition-colors">
            Keluar
          </button>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>