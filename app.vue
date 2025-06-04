<script setup lang="ts">
import { watch } from "vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
const store = useStore();

// Watch the modal state in the Pinia store
watch(() => store.showModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden"; // Disable scrolling
  } else {
    document.body.style.overflow = ""; // Restore scrolling
  }
});
</script>

<template>
  <div class="max-w-screen overflow-x-hidden dark:bg-gray-900" :class="store.showModal ? 'overflow-y-hidden' : ''">
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome /> -->
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
