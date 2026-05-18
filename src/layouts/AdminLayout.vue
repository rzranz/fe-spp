<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const user = ref({})

// STATE UNTUK MENGONTROL SIDEBAR DI MOBILE
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// LOGIKA AUTHENTICATION LU (TIDAK DIUBAH)
onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    user.value = JSON.parse(userStr)
  } else {
    window.location.href = '/login'
  }
})

// LOGIKA LOGOUT LU (TIDAK DIUBAH)
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
  <div class="flex h-screen bg-slate-100 overflow-hidden font-sans">
    
    <div 
      v-show="isSidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
    ></div>

    <aside 
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-xl lg:shadow-none"
    >
      <div class="h-16 flex items-center justify-between px-4 font-bold text-xl border-b border-indigo-700 bg-indigo-950 shadow-sm shrink-0">
        <span class="flex-1 text-center">Darul Fikri</span>
        <button @click="toggleSidebar" class="lg:hidden text-indigo-300 hover:text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <div class="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 mt-2 px-2">
            Administrator
        </div>

        <RouterLink @click="toggleSidebar" to="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3">📊</span> Dashboard
        </RouterLink>
        
        <RouterLink @click="toggleSidebar" to="/admin/students" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3"></span> Data Siswa
        </RouterLink>

        <RouterLink @click="toggleSidebar" to="/admin/classrooms" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3"></span> Kelola Kelas
        </RouterLink>

        <RouterLink @click="toggleSidebar" to="/admin/fees" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3"></span> Master Biaya
        </RouterLink>
        
        <RouterLink @click="toggleSidebar" to="/admin/bills" class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-indigo-700" active-class="bg-indigo-600 shadow-md">
            <span class="mr-3"></span> Kelola Tagihan
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-indigo-800 bg-indigo-950 shrink-0">
        <div class="flex items-center mb-4">
            <div class="ml-3">
                <p class="text-sm font-medium text-white">{{ user.name }}</p>
                <p class="text-xs text-indigo-300 bg-indigo-800 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wide">
                    ADMIN
                </p>
            </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
          Keluar
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden shrink-0">
        <button 
          @click="toggleSidebar" 
          class="p-2 -ml-2 mr-2 text-slate-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <span class="font-bold text-slate-800">Panel Admin</span>
        <div class="w-6"></div> </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <RouterView />
        </div>
      </main>

    </div>

  </div>
</template>

<style scoped>
/* Optional: Supaya scrollbar sidebar terlihat lebih rapi */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
