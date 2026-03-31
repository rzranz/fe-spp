<script setup>
// Komponen statis, gak butuh props
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
    <div class="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="font-bold text-gray-800">Butuh Bantuan?</h3>
    </div>
    <div class="p-5">
      <p class="text-sm text-gray-600 mb-4 leading-relaxed">
        Jika ada kendala pembayaran atau perbedaan data, hubungi Tata Usaha.
      </p>
      <a href="https://wa.me/6285759903640" target="_blank" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-sm active:scale-95">
        Tanya via WhatsApp
      </a>
    </div>
  </div>
</template>