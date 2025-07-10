<template>
  <Transition name="fade" mode="out-in">
    <div class="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 z-50 grid items-center "
      v-show="store.showModal" @click="store.toggleModal">
      <div
        class="flex flex-col items-center justify-start gap-4 overflow-scroll modal w-11/12 h-screen md:w-4/5 md:h-4/5 bg-white 2xl:max-w-3/4">
        <div class="">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { data: posts, isSuccess } = usePosts();
import { ref, onMounted } from 'vue';

import { useStore } from '~/stores/store';
const store = useStore();

onMounted(() => {
  setTimeout(() => {
    store.showModal = false; // Show modal after a delay
  }, 10000); // Adjust the delay as needed
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  place-items: center;
}

.modal {
  background-color: white;
  /* border-radius: 10px; */
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}
</style>