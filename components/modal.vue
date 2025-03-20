<template>
   <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 z-50 grid items-center " v-show="store.showModal" @click="store.toggleModal">
    <div className="flex flex-col items-center justify-start gap-4 overflow-scroll modal bg-white" v-if="isSuccess">
      <div className="flex flex-col justify-center gap-5  text-left modal-content">
        <!-- <h1 className="text-5xl font-bold">
         {{testPost?.title}} 
        </h1> -->
        <wp-content :content="testPost?.content" :url="testPost?.link" />
      </div>
      <!-- <div className="flex flex-col justify-center gap-5 px-24 pt-32 text-left pb-96 modal-content">
        <h1 className="text-2xl font-bold text-black">
          {{testPost?.title}}
        </h1>
        <p className="text-xl text-black">
          
        </p>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '~/stores/store';
const {data: posts, isSuccess} = usePosts();
const store = useStore();
const testPost = computed(() => {
  return posts.value?.at(0);
});
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