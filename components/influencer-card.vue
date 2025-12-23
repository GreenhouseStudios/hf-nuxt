<style scoped>
.influencer-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3/4;
  transition: transform 0.3s ease;
  padding-bottom: 4rem;
}

.influencer-card:hover {
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

/* Info overlay - always at bottom */
.info-overlay {
  position: absolute;
  bottom: -2px;
  left: -2px;
  right: -2px;
  background: white;
  padding: 1.5rem;
  padding-left: 2rem;
  padding-bottom: 1rem;
  transition: padding-bottom 0.4s ease;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  border-top-left-radius: 50%;
}

.influencer-card:hover .info-overlay {
  padding-bottom: 4.5rem;
}

/* Skyline background - inside white container */
.skyline-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7rem;
  background: url("/hf_skyline.svg") no-repeat center bottom;
  background-size: cover;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  pointer-events: none;
  z-index: 5;
}

.influencer-card:hover .skyline-bg {
  opacity: 1;
  transform: translateY(10px);
}

/* Text content */
.info-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  transition: font-size 0.3s ease;
  position: relative;
  z-index: 1;
}

.info-title {
  font-size: 0.875rem;
  color: #0C6DD4;
  margin: 0.25rem 0 0;
  opacity: 1;
  max-height: 20px;
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease;
  position: relative;
  z-index: 1;
}

.info-town {
  font-size: 0.875rem;
  color: #0C6DD4;
  font-weight: 600;
  margin: 0.5rem 0 0;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.3s ease 0.1s, max-height 0.3s ease 0.1s;
  position: relative;
  z-index: 1;
}

.influencer-card:hover .info-title {
  opacity: 0;
  max-height: 0;
}

.influencer-card:hover .info-town {
  opacity: 1;
  max-height: 20px;
}
</style>

<template>
  <div class="influencer-card rounded-2xl" @click="emit('click')">
    <!-- Image -->
    <img
      :src="imageSource"
      :alt="influencer.influencerDetails.name"
      class="card-image rounded-2xl"
    />
    <div class="info-overlay">
      <!-- Skyline background (revealed on hover, inside white container) -->
      <div class="skyline-bg z-1"></div>
      
      <h3 class="info-name text-right">
        {{ influencer.influencerDetails.honorific
          ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
          : influencer.influencerDetails.name
        }}
      </h3>
      <p class="info-title text-right">{{ influencer.influencerDetails.title || 'Influencer' }}</p>
      <p class="info-town text-right">{{ influencer.influencerDetails.town || 'Hartford' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  };
}>()

const imageSource = computed(() => {
  const image = props.influencer.influencerDetails.image?.node;
  if (image) {
    const imageSizes = image.mediaDetails.sizes;
    const mediumImage = imageSizes?.find(size => size.name === 'medium_large');
    if (mediumImage) {
      return mediumImage.sourceUrl;
    }
    return image.sourceUrl;
  }
  return '/placeholder.png';
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

