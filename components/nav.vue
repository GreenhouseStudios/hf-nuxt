<template>
  <div class="flex items-center justify-between px-4 py-4 fixed z-100 top-0 max-w-screen w-screen">
    <Logo></Logo>

    <UNavigationMenu :items="items" color="primary" class="bg-white hidden lg:flex"></UNavigationMenu>


    <USlideover class="max-w-screen" v-model:open="isOpen" close-icon="i-lucide-arrow-right" :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }">
      <UButton icon="i-heroicons-bars-3" color="gray" variant="ghost" @click="isOpen = true" class="lg:hidden" />
      <template #body>
        <div class="p-4">
          <div class="mb-4 text-lg font-semibold">Greater Hartford Gives Centennial</div>
          <UButton @click="() => handleClick(item.to)"
            v-for="item in items" :key="item.label" block variant="ghost" :label="item.label" class="mb-2" />
        </div>
      </template>

    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui/dist/module';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const handleClick = async (to: string) => {
  isOpen.value = false;
  await new Promise(resolve => setTimeout(resolve, 300))
  router.push(to);
};

const isOpen = ref(false);

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
div {
  background: white;
}
</style>