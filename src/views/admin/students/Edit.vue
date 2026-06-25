<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import Api from '../../../api/axios'

const route = useRoute()
const router = useRouter()

const studentId = route.params.id

const isLoading = ref(false)
const classrooms = ref([])

const form = ref({
  nis: '',
  name: '',
  class_id: '',
  password: '',
  parent_name: '',
  phone_number: '',
  address: ''
})

const fetchClassrooms = async () => {
  try {
    const response = await Api.get('/admin/classrooms')
    classrooms.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const fetchStudent = async () => {
  try {
    const response = await Api.get(`/admin/students/${studentId}`)
    const data = response.data.data
    
    form.value = {
      nis: data.nis,
      name: data.name,
      class_id: data.class_id,
      parent_name: data.parent_name,
      phone_number: data.phone_number,
      address: data.address
    }
  } catch (error) {
    console.error(error)
    Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data siswa.' })
      .then(() => router.push('/admin/students'))
  }
}

onMounted(() => {
  fetchClassrooms()
  fetchStudent()
})

const handleUpdate = async () => {
  isLoading.value = true
  try {
    await Api.put(`/admin/students/${studentId}`, form.value)
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Data siswa berhasil diperbarui',
      showConfirmButton: false,
      timer: 1500
    }).then(() => router.push('/admin/students'))
    
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Gagal update data.'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Edit Data Siswa</h2>
      <RouterLink to="/admin/students" class="text-gray-500 hover:text-gray-700">&larr; Kembali</RouterLink>
    </div>

    <div class="bg-white shadow sm:rounded-lg p-6">
      <form @submit.prevent="handleUpdate" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        
        <div>
          <label class="block text-sm font-medium text-gray-700">NIS</label>
          <input v-model="form.nis" type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Kelas</label>
          <select v-model="form.class_id" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            <option value="" disabled>-- Pilih Kelas --</option>
            <option v-for="cls in classrooms" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password Baru (Opsional)</label>
          <input v-model="form.password" type="password" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Kosongkan jika tidak ingin diubah">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Orang Tua/Wali</label>
          <input v-model="form.parent_name" type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
          <input v-model="form.phone_number" type="text" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
          <textarea v-model="form.address" rows="3" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
        </div>

        <div class="sm:col-span-2 flex justify-end">
          <button type="submit" :disabled="isLoading" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-sm">
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>