<template>
  <div class="influencer-modal-content bg-white rounded-2xl max-w-4xl mx-auto p-8 relative">
    <!-- Close button -->
    <button 
      class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none z-10"
      @click="store.closeModal()"
    >
      &times;
    </button>

    <div class="modal-inner">
      <!-- Floating image top left -->
      <img
        v-if="imageSource"
        :src="imageSource"
        :alt="influencer?.influencerDetails?.name"
        class="float-left mr-6 mb-4 rounded-xl w-64 h-80 object-cover"
      />

      <!-- Content -->
      <div class="content-text">
        <h2 class="text-4xl font-bold mb-2 text-gray-900">
          {{ influencer?.influencerDetails?.honorific
            ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
            : influencer?.influencerDetails?.name
          }}
        </h2>
        
        <p class="text-lg text-blue-600 mb-1">
          {{ influencer?.influencerDetails?.title || 'Influencer' }}
        </p>
        
        <p class="text-md text-blue-600 font-semibold mb-6">
          {{ influencer?.influencerDetails?.town || 'Hartford' }}
        </p>

        <p class="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
          {{ influencer?.influencerDetails?.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '~/stores/store'


const store = useStore()

const props = defineProps<{
  influencer: {
    id: string;
    title: string;
    slug: string;
    link: string;
    influencerDetails: {
      honorific: string;
      name: string;
      title: string;
      town: string;
      description: string;
      image?: {
        node?: {
          sourceUrl: string;
          altText: string;
          mediaDetails: {
            sizes: {
              name: string;
              sourceUrl: string;
              width: number;
              height: number;
            }[];
          };
        };
      };
    };
  } | null;
}>()

console.log(props?.influencer?.influencerDetails?.description)

const imageSource = computed(() => {
  const image = props.influencer?.influencerDetails?.image?.node;
  if (image) {
    const imageSizes = image.mediaDetails?.sizes;
    const largeImage = imageSizes?.find(size => size.name === 'large' || size.name === 'medium_large');
    if (largeImage) {
      return largeImage.sourceUrl;
    }
    return image.sourceUrl;
  }
  return null;
})
</script>

<style scoped>
.influencer-modal-content {
  max-height: 85vh;
  overflow-y: auto;
}

.modal-inner {
  clear: both;
  overflow: auto;
}
</style>
