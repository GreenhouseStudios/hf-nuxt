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
  <div :class="store.showModal ? 'overflow-y-hidden' : ''">
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
</style>
