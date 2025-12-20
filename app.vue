<script setup lang="ts">
import { watch } from "vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { onMounted, ref } from "vue";
import { useStore } from '~/stores/store';

const store = useStore();

// Watch the modal state in the Pinia store
watch(() => store.showModal, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});



</script>

<template>
  <div class="max-w-screen dark:bg-gray-900" :class="store.showModal ? 'overflow-y-hidden' : ''">
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
    <Modal />
    <VueQueryDevtools/>
  </div>
</template>

<style>
body {
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.no-scroll {
  overflow: hidden;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
