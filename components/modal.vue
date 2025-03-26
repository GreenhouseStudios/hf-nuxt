<template>
   <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 z-50 grid items-center " v-show="store.showModal" @click="store.toggleModal">
    <div className="flex flex-col items-center justify-start gap-4 overflow-scroll modal bg-white" v-if="isSuccess">
      <div className="flex flex-col justify-center gap-5  text-left modal-content">
        <wp-content :content="store.modalPost?.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {data: posts, isSuccess} = usePosts();

import { useStore } from '~/stores/store';
const store = useStore();
</script>

<style>
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  place-items: center;
}
.modal{
  width: 80%;
  height: 80%;
  background-color: white;
  /* border-radius: 10px; */
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}
</style>