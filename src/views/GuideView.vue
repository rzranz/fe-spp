<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push({ path: '/' });
};

const goToLogin = (role) => {
  router.push({ path: '/login', query: { role } });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    
    <!-- Navbar -->
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          
          <div class="flex items-center gap-3 cursor-pointer" @click="goToHome">
            <div class="flex h-11 w-11 items-center justify-center rounded-md bg-white p-1 overflow-hidden shadow-sm">
              <img src="/logo.png" alt="Logo Sekolah" class="w-full h-full object-contain" />
            </div>
            <span class="text-xl font-extrabold text-slate-800 tracking-tight hidden sm:block">RA. Darul Fikri</span>
          </div>
          
          <div class="flex items-center gap-4">
            <button @click="goToHome" class="text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
              Beranda
            </button>
            <button @click="goToLogin('student')" class="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all active:scale-95">
              Masuk
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow">
      <!-- Hero Section -->
      <div class="bg-indigo-600 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div class="max-w-3xl mx-auto relative z-10">
          <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Panduan Penggunaan Aplikasi</h1>
          <p class="text-lg md:text-xl text-indigo-100 leading-relaxed">
            Ikuti langkah-langkah mudah di bawah ini untuk melihat dan melakukan pembayaran SPP putra/putri Anda.
          </p>
        </div>
      </div>

      <!-- Steps Section -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <!-- Step 1 -->
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div class="w-full md:w-1/2 order-2 md:order-1">
            <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 md:-left-6 md:translate-x-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 border-slate-50">1</div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4">Masuk ke Portal Wali Murid</h3>
              <p class="text-slate-600 leading-relaxed mb-6">
                Untuk memulai, silakan masuk ke dalam sistem menggunakan kredensial yang telah diberikan oleh pihak sekolah.
              </p>
              <ul class="space-y-3 text-slate-600">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Klik tombol <strong>Masuk</strong> di pojok kanan atas atau di halaman utama.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Masukkan <strong>NISN</strong> (Nomor Induk Siswa Nasional) putra/putri Anda.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Masukkan <strong>Password</strong> bawaan yang diberikan oleh admin sekolah (biasanya default: "password").</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
            <div class="bg-indigo-50 w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div class="w-full md:w-1/2 flex justify-center">
             <div class="bg-blue-50 w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
          </div>
          <div class="w-full md:w-1/2">
            <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 md:-left-6 md:translate-x-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 border-slate-50">2</div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4">Cek Tagihan Pembayaran</h3>
              <p class="text-slate-600 leading-relaxed mb-6">
                Setelah berhasil masuk, Anda akan diarahkan ke halaman Dashboard (Beranda). Di sana Anda dapat melihat informasi tagihan.
              </p>
              <ul class="space-y-3 text-slate-600">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Lihat daftar tagihan yang <strong>Belum Lunas</strong> pada menu "Tagihan Saya" atau di halaman utama Dashboard.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Detail tagihan seperti nominal SPP, bulan, dan tenggat waktu akan tertera dengan jelas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div class="w-full md:w-1/2 order-2 md:order-1">
            <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 md:-left-6 md:translate-x-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 border-slate-50">3</div>
              <h3 class="text-2xl font-bold text-slate-800 mb-4">Lakukan Pembayaran</h3>
              <p class="text-slate-600 leading-relaxed mb-6">
                Pilih tagihan yang ingin dibayar, lalu ikuti proses pembayaran yang aman melalui QRIS Pakasir.
              </p>
              <ul class="space-y-3 text-slate-600">
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <span>Klik tombol <strong>Bayar</strong> pada tagihan yang dipilih.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <span>Selesaikan pembayaran menggunakan kode <strong>QRIS Pakasir</strong> yang tampil pada layar.</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-6 h-6 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <span>Selesaikan pembayaran sesuai instruksi yang muncul di layar. Status akan <strong>otomatis Lunas</strong> jika pembayaran berhasil!</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
             <div class="bg-green-50 w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Call to Action -->
      <div class="bg-slate-100 py-12 text-center border-t border-slate-200">
        <h2 class="text-2xl font-bold text-slate-800 mb-4">Sudah paham cara penggunaannya?</h2>
        <button @click="goToLogin('student')" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
          Masuk ke Portal Sekarang
        </button>
      </div>

    </main>

    <footer class="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
      <p>&copy; 2026 RA. Darul Fikri. Sistem Informasi Pembayaran.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Optional: Add some smooth scrolling or animations */
</style>
