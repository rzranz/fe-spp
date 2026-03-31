<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue' // Pastikan path ini benar!

const route = useRoute()
</script>

<template>
  <div v-if="!route.meta.hideNavbar">
    <Navbar />
  </div>

  <RouterView />
</template>