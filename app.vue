<script setup lang="ts">
import Index from './pages/index.vue';

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
     <NuxtLayout>
      <NuxtPage/>
     </NuxtLayout>
     <Modal />
  </div>
</template>

<style>
body{
  font-family: 'Inter', sans-serif;
}
</style>
