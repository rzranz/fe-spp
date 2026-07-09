<script setup>
defineProps({
  students: { type: Array, required: true },
  isLoading: { type: Boolean, required: true }
});

const emit = defineEmits(["delete"]);
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center py-20 text-indigo-600 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mt-4">
    <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span class="font-medium">Memuat data...</span>
  </div>

  <div v-else class="mt-4 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">NIS</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nama Lengkap</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kelas</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="student in students" :key="student.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ student.nis }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ student.name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ student.class_name }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-green-50 text-green-700 ring-green-600/20': student.status === 'Aktif',
                      'bg-yellow-50 text-yellow-800 ring-yellow-600/20': student.status === 'Cuti',
                      'bg-red-50 text-red-700 ring-red-600/20': student.status === 'Non-Aktif',
                    }"
                  >
                    {{ student.status }}
                  </span>
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                  <RouterLink :to="{ name: 'students.edit', params: { id: student.id } }" class="text-indigo-600 hover:text-indigo-900">Edit</RouterLink>
                  <button @click="emit('delete', student.id, student.name)" class="text-red-600 hover:text-red-900">Hapus</button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500 text-sm">Siswa tidak ditemukan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>