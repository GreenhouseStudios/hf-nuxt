<script setup lang="ts">
import { watch } from "vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { onMounted, ref } from "vue";
import { useStore } from "~/stores/store";

const store = useStore();

// Watch the modal state in the Pinia store
watch(() => store.showModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden"; // Disable scrolling
  } else {
    document.body.style.overflow = ""; // Restore scrolling
  }
});

// composable or inside `setup()`
const hasSeenModalAnimation = ref(false)

onMounted(() => {
  store.showModal = true // show modal on first visit
  if (localStorage.getItem('hasSeenModalAnimation')) {
    store.showModal = false // hide modal on subsequent visits
    hasSeenModalAnimation.value = true
  } else {
    
    localStorage.setItem('hasSeenModalAnimation', 'true')
    hasSeenModalAnimation.value = false // show animation
  }
})
</script>

<template>
  <div class="max-w-screen dark:bg-gray-900" :class="store.showModal ? 'overflow-y-hidden' : ''">
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
    <Modal>
      <div class=" bg-gray-200 grid p-56" v-if="!hasSeenModalAnimation">
        <h1 class="text-5xl font-bold p-36 text-center text-black">Logo Transformation Animation</h1>
      </div>
      <wp-content v-else-if="store.modalPost" class="flex flex-col justify-center gap-5 text-left modal-content" :content="store.modalPost?.content"/>
    </Modal>
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
