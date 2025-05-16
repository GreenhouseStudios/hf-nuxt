<template>

  <div class="flex flex-col overflow-hidden shadow-md rounded-2xl column hover:bg-gray-200 feature grow h-121"
    :class="isQuote ? '' : ``" @click="handleCardClick">
    <img v-if="(isDefault || isOther) && hasMainImage" :src="props.post?.cardOptions.mainImage.node.mediaItemUrl"
      class="max-h-1/2" :class="isDefault || isQuote ? 'shrink' : 'grow'" alt="">
    <img v-else-if="isDefault || isOther"
      :src="`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${Math.floor(Math.random() * 100) + 300}/${Math.floor(Math.random() * 100) + 300}`"
      class="bg-auto" :class="isDefault || isQuote ? 'shrink' : 'grow'" alt="">
    <CardContent v-if="isDefault" :post="props.post" />
    <QuoteContent v-if="isQuote" :post="props.post" />
    <DecadeContent v-if="actualVariation === 'decade'" />
  </div>


</template>

<script lang="ts" setup>
const props = defineProps<{
  post: Post
}>();
import { useStore } from '~/stores/store';

const variations = ['default', 'quote', 'other'];
// const actualVariation = computed(() => props.random ? variations[Math.floor(Math.random() * variations.length)] : props.variation);
const actualVariation = computed(() => props.post?.cardOptions?.type ? props.post?.cardOptions.type : 'default');
const isDefault = computed(() => actualVariation.value === 'default');
const isQuote = computed(() => actualVariation.value === 'quote');
const isOther = computed(() => actualVariation.value === 'other');
const hasMainImage = computed(() => !!props.post?.cardOptions?.mainImage)
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