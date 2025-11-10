<template>

  <div class="flex flex-col rounded-2xl relative column feature grow"
    :class="[
        containerClass,
        isQuote? 'overflow-visible' : 'overflow-hidden',
        isQuote? 'z-50' : 'z-10',
        isDefault? 'shadow-md hover:bg-lavender' : '',
        isMajor? 'justify-center' : ''
        ]"
    @click="handleCardClick">
    <img v-if="(isDefault) && hasMainImage" :src="props.post?.eventOptions.image.node.mediaItemUrl"
      class="min-h-24 grow object-cover" :class="isDefault || isQuote ? 'shrink' : 'grow'" alt="">
      <!-- Backup Placeholder Image from picsum.photos -->
    <img v-else-if="isDefault"
      :src="`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${Math.floor(Math.random() * 100) + 300}/${Math.floor(Math.random() * 100) + 300}`"
      class="bg-auto" :class="isDefault || isQuote ? 'shrink' : 'grow'" alt="">
    <CardContent v-if="isDefault" :post="props.post" />
    <QuoteContent v-if="isQuote" :post="props.post" />
    <MajorContent v-if="isMajor" :post="props.post" />
  </div>


</template>

<script lang="ts" setup>

import { ref, computed } from 'vue';
import { useStore } from '~/stores/store';
import QuoteContent from "~/components/quote-content.vue";
import CardContent from "~/components/card-content.vue";
import MajorContent from "~/components/major-content.vue";

const props = withDefaults(defineProps<{
  post: Post;
  mode: 'fixedHeight' | 'autoHeight';
  xMultiplier?: number;
  yMultiplier?: number;
}>(), {
  xMultiplier: 1,
  yMultiplier: 1
});

const variations = ['default', 'quote', 'covid'];
// const actualVariation = computed(() => props.random ? variations[Math.floor(Math.random() * variations.length)] : props.variation);
const actualVariation = computed(() => props.post?.eventOptions?.postType ? props.post?.eventOptions.postType : 'default');
const isDefault = computed(() => actualVariation.value === 'default');
const isQuote = computed(() => actualVariation.value === 'quote');
const isMajor = computed(() => actualVariation.value === 'major_event');
const hasMainImage = computed(() => !!props.post?.eventOptions?.image)
const containerClass = computed(() => {
  let result = '';
  if (props.mode === 'fixedHeight') {
    result = 'h-80 md:min-h-121';
  } else {
    result = 'h-auto';
  }
  if (isDefault.value || isQuote.value) result += ' w-full';
  else result += ` md:w-${80 * props.xMultiplier}`;
  return result;
});
const store = useStore();
// const randomMultiplier = Math.ceil(Math.random() * 3) + 2;
// Random choice of 2 or 4
const randomMultiplier = 4;

const handleCardClick = () => {
  if (isDefault.value) {
    showModal();
  }
}
const showModal = () => {
  store.setModalPost(props.post);
}
</script>

<style scoped>

.feature {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}

/* card */

/* Auto layout */
/* display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

position: absolute;
width: 418px;
height: 421px;
left: 0px;
top: 0px;

background: rgba(0, 122, 253, 0.13);

border-radius: 15px; */
</style>