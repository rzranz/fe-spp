<script setup>
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Api from '../../api/axios';

const router = useRouter();

const handleLogout = async () => {
  try {
    await Api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  } catch (error) {
    console.error('Logout error');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-indigo-600 shadow-md">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-indigo-600">
              DF
            </div>
            <span class="text-xl font-bold text-white tracking-wide">TK Darul Fikri</span>
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