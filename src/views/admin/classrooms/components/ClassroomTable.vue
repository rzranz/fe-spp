<script setup>
defineProps({
  classrooms: { type: Array, required: true },
  isLoading: { type: Boolean, required: true }
});

const emit = defineEmits(["view", "edit", "delete"]);
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center py-20 text-indigo-600 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mt-4">
    <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span class="font-medium">Memuat data kelas...</span>
  </div>
  <div v-else class="mt-4 flow-root">
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 w-16">ID</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nama Kelas</th>
            <th class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(classroom, index) in classrooms" :key="classroom.id">
            <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{{ index + 1 }}</td>
            <td class="px-3 py-4 text-sm text-gray-700 font-semibold">{{ classroom.name }}</td>
            <td class="py-4 pl-3 pr-4 text-right text-sm font-medium space-x-3">
              <button @click="emit('view', classroom.id, classroom.name)" class="text-green-600 hover:text-green-900 font-bold">Lihat Siswa</button>
              <button @click="emit('edit', classroom.id, classroom.name)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button @click="emit('delete', classroom.id, classroom.name)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
          <tr v-if="classrooms.length === 0">
            <td colspan="3" class="text-center py-8 text-gray-500">Belum ada data kelas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>