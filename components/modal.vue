<template>
  <Transition name="fade" mode="out-in">
    <div 
      class="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[9999] flex"
      :class="{
        'items-center justify-center': !isPost(store.modalPost),
        'pt-20': isPost(store.modalPost)
      }"
      v-show="store.showModal"
      @click.self="store.closeModal()"
    >
      <!-- Show influencer content if modalPost has influencerDetails -->
      <InfluencerModalContent 
        v-if="store.showModal && isInfluencer(store.modalPost)"
        :influencer="store.modalPost"
      />
      <!-- Otherwise show post content -->
      <PostContent 
        v-else-if="store.showModal && isPost(store.modalPost)"
        :post="store.modalPost" 
      />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import PostContent from "~/components/post-content.vue";
import InfluencerModalContent from "~/components/influencer-modal-content.vue";
import { useStore } from '~/stores/store';
import { ref, onMounted, onUpdated } from 'vue'
const store = useStore();

function isInfluencer(x: unknown): x is Influencer {
  return !!x && typeof x === 'object' && 'influencerDetails' in x;
}

function isPost(x: unknown): x is Post {
  return !!x && typeof x === 'object' && 'eventOptions' in x;
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  backdrop-filter: blur(2px);
}

.modal {
  background-color: white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}
</style>