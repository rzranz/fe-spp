<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const user = ref({})

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    user.value = JSON.parse(userStr)
  } else {
    window.location.href = '/login'
  }
})

const handleLogout = () => {
  Swal.fire({
    title: 'Keluar?',
    text: "Sesi anda akan diakhiri.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Keluar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear()
      window.location.href = '/' 
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex">
    
    <aside class="w-64 bg-indigo-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-50">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b border-indigo-700 bg-indigo-950 shadow-sm">
        <span>Darul Fikri</span>
      </div>
      
      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 mt-2 px-2">
            Administrator
        </div>

        <RouterLink to="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">📊</span> Dashboard
        </RouterLink>
        
        <RouterLink to="/admin/students" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">🎓</span> Data Siswa
        </RouterLink>

        <RouterLink to="/admin/classrooms" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">🏫</span> Kelola Kelas
        </RouterLink>

        <RouterLink to="/admin/fees" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">🏷️</span> Master Biaya
        </RouterLink>
        
        <RouterLink to="/admin/bills" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">💰</span> Kelola Tagihan
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-indigo-800 bg-indigo-950">
        <div class="flex items-center mb-4">
            <div class="ml-3">
                <p class="text-sm font-medium text-white">{{ user.name }}</p>
                <p class="text-xs text-indigo-300 bg-indigo-800 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wide">
                    ADMIN
                </p>
            </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
          Keluar
        </button>
      </div>
    </aside>

    <main class="flex-1 ml-64 p-8 bg-slate-100 min-h-screen">
      <RouterView />
    </main>

  </div>
</template>