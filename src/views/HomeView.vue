<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = (role) => {
  router.push({ path: '/login', query: { role } });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-md bg-white p-1 overflow-hidden shadow-sm">
              <img src="/logo.png" alt="Logo Sekolah" class="w-full h-full object-contain" />
            </div>
            <span class="text-xl font-extrabold text-slate-800 tracking-tight">RA. Darul Fikri</span>
          </div>
          
          <div>
            <button @click="goToLogin('admin')" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-5 py-2.5 rounded-lg transition-colors border border-indigo-200">
              Portal Admin
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        
        <div class="w-full lg:w-1/2 text-center lg:text-left space-y-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-4">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Sistem Pembayaran Terintegrasi Midtrans
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Bayar SPP <br class="hidden lg:block">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Lebih Mudah & Aman</span>
          </h1>
          
          <p class="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Portal resmi administrasi keuangan RA. Darul Fikri. Cek tagihan, lakukan pembayaran via QRIS, Virtual Account, atau Minimarket, dan pantau riwayat pelunasan secara real-time.
          </p>
          
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button @click="goToLogin('student')" class="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
              Masuk Portal Wali Murid
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

          <div class="w-full lg:w-1/2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
              <div class="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Cek Tagihan Instan</h3>
              <p class="text-slate-500 text-sm flex-grow">Lihat rincian kewajiban administrasi tanpa harus datang ke sekolah.</p>
            </div>
            
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
              <div class="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Multi Pembayaran</h3>
              <p class="text-slate-500 text-sm flex-grow">Dukung metode bayar modern: Bank Transfer, QRIS, e-Wallet, & Minimarket.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
              <div class="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Rekap Otomatis</h3>
              <p class="text-slate-500 text-sm flex-grow">Pembayaran langsung tercatat lunas di sistem detik itu juga. Bebas khawatir.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
              <div class="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="font-bold text-slate-800 text-lg mb-2">Akses 24 Jam</h3>
              <p class="text-slate-500 text-sm flex-grow">Lakukan pengecekan dan pembayaran kapan saja dari smartphone Anda.</p>
            </div>

          </div>
        </div>

        </div>
    </main>

    <footer class="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
      <p>&copy; 2026 RA. Darul Fikri. Sistem Informasi Pembayaran.</p>
    </footer>
  </div>
</template>