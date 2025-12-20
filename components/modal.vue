<template>
  <Transition name="fade" >
    <div
        v-if="store.showModal"
        class="modal-center modal-overlay overflow-scroll fixed top-20 w-11/12 h-full bg-black bg-opacity-10 z-50 flex"
    >
      <PostContent v-if="store.modalPost" :post="store.modalPost" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import PostContent from "~/components/post-content.vue"
import { useStore } from "~/stores/store"

const store = useStore()
</script>
<style scoped>
  .modal-center {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
