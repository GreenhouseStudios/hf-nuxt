<template>

  <div class="flex flex-col rounded-2xl relative column grow"
    :class="[
        containerClass,
        isQuote? 'overflow-visible' : 'overflow-hidden',
        isDefault? 'shadow-md hover:bg-lavender bg-white' : '',
        'feature'
        ]"
    @click="handleCardClick">
    <img v-if="(isDefault) && hasMainImage" :src="imageSource"
      class="card-img grow object-cover" :class="isDefault || isQuote ? 'shrink' : 'grow'" :alt="props.post?.eventOptions.thumbnail.node.altText">
      <!-- Backup Placeholder Image from picsum.photos -->
    <img v-else-if="isDefault"
      src="/placeholder.png"
      class="bg-auto card-img" :class="isDefault || isQuote ? 'shrink' : 'grow'" alt=""
      data-placeholder="1"
    >
    <CardContent v-if="isDefault" :post="props.post"
      :class="isCovid ? 'flex-1' : ''"
    />
    <QuoteContent v-if="isQuote" :post="props.post" :can-play="props.quoteCanStart"/>
  </div>


</template>

<script lang="ts" setup>

import { ref, computed, watch } from 'vue';
import { useStore } from '~/stores/store';
import QuoteContent from "~/components/quote-content.vue";
import CardContent from "~/components/card-content.vue";
import MajorContent from "~/components/major-content.vue";

const props = withDefaults(defineProps<{
  post: Post;
  mode: 'fixedHeight' | 'autoHeight';
  xMultiplier?: number;
  yMultiplier?: number;
  covidShown?: boolean;
  quoteCanStart?: boolean;
}>(), {
  xMultiplier: 1,
  yMultiplier: 1,
  quoteCanStart: false
});

const variations = ['default', 'quote', 'covid'];


// const actualVariation = computed(() => props.random ? variations[Math.floor(Math.random() * variations.length)] : props.variation);
const actualVariation = computed(() => props.post?.eventOptions?.postType ? props.post?.eventOptions.postType : 'default');
const isDefault = computed(() => actualVariation.value === 'default' || actualVariation.value === 'covid_post')
const isQuote = computed(() => actualVariation.value === 'quote');
const isCovid = computed(() => actualVariation.value === 'covid_post');
const hasMainImage = computed(() => !!props.post?.eventOptions?.thumbnail)
const imageSource = computed(() => {
  if (hasMainImage.value) {
    const imageSizes = props.post?.eventOptions?.thumbnail.node.mediaDetails.sizes;
    // find the medium size image, if it exists, fallback to mediaItemUrl
    const largeImage = imageSizes?.find(size => size.name === 'medium_large');
    if (largeImage) {
      return largeImage.sourceUrl;
    }
    return props.post?.eventOptions?.thumbnail.node.mediaItemUrl;
  } else {
    return '/placeholder.png';
  }
});
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



  const showModal = () => {
    store.setModalPost(props.post);

  }


const handleCardClick = () => {
  if (isDefault.value) {
    showModal()
  }
}

</script>

<style scoped>

.card-img{
  width: 100%;
  max-height: var(--imgMaxPct, 50%);
  object-fit: cover;
  display: block;
}



.feature {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}
.feature-covid {
  box-shadow: 0px 0px 20px rgb(123 57 1);
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