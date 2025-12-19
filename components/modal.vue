<template>
  <Transition name="fade" mode="out-in">
    <div 
      class="modal-overlay fixed top-20 w-11/12 h-full bg-black bg-opacity-10 z-50 flex"
      v-show="store.showModal"
      @click.self="store.toggleModal()"
    >
      <!-- Show influencer content if modalPost has influencerDetails -->
      <InfluencerModalContent 
        v-if="store.showModal && store.modalPost?.influencerDetails" 
        :influencer="store.modalPost" 
      />
      <!-- Otherwise show post content -->
      <PostContent 
        v-else-if="store.showModal" 
        :post="store.modalPost" 
      />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import PostContent from "~/components/post-content.vue";
import InfluencerModalContent from "~/components/influencer-modal-content.vue";

const { data: posts, isSuccess } = usePosts();
import { ref, onMounted, watch } from 'vue';

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
  left: 50%;
  transform: translateX(-50%);
}

.modal {
  background-color: white;
  /* border-radius: 10px; */
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}
</style>