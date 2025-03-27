<template>
  <div class=" flex items-center justify-between px-4 py-4">
    <Logo></Logo>

    <UNavigationMenu :items="items" color="primary" class="bg-white"></UNavigationMenu>

  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui/dist/module';

const items = ref(<NavigationMenuItem[]>[
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
  },
  {
    label: 'MAKE AN IMPACT',
    to: '/impact'
  },
  {
    label: 'CONTACT US',
    to: '/contact',
  }
].map((item) => ({
  ...item,
  class: 'bg-white hover:bg-gray-100 rounded-md',
})));
</script>

<style scoped>
div{
  background: white;
}
</style>