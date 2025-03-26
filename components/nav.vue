<template>
  <div class=" flex items-center justify-between px-4 py-4">
    <Logo></Logo>

    <UNavigationMenu :items="items"></UNavigationMenu>

  </div>
</template>

<script setup lang="ts">
const items = ref([
  {
    label: 'OVERVIEW',
    to: '/',
    
  },
  {
    label: 'OUR TIMELINE',
    to: '/timeline',
  },
  {
    label: '100 INFLUENCERS',
    to: '/influencers',
    active: true,
    
  },
  {
    label: 'MAKE AN IMPACT',
    target: '/impact'
  },
  {
    label: 'CONTACT US',
    to: '/contact',
  }
])
</script>

<style></style>