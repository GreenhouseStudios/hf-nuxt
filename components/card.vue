<template>
  <div class="flex flex-col grow overflow-hidden shadow-md rounded-2xl column hover:bg-gray-200 feature shrink"
    @click="handleCardClick">
    <img v-if="isDefault || isOther"
      :src="`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${Math.floor(Math.random() * 100) + 300}/${Math.floor(Math.random() * 100) + 300}`"
      class="bg-auto" :class="isDefault ? 'shrink' :'grow'" alt="">
    <CardContent v-if="isDefault" :post="props.post" />
    <QuoteContent v-if="isQuote" :post="props.post" />
    <DecadeContent v-if="actualVariation === 'decade'" />
  </div>

</template>

<script lang="ts" setup>

const props = defineProps({
  // variation: {
  //   type: String,
  //   default: 'default'
  // },
  // random: {
  //   type: Boolean
  // },
  post:{
    type: Object
  }
});
import { useStore } from '~/stores/store';

const variations = ['default', 'quote', 'other'];
// const actualVariation = computed(() => props.random ? variations[Math.floor(Math.random() * variations.length)] : props.variation);
const actualVariation = computed( () => props.post?.cardOptions.type ? props.post.cardOptions.type[0] : 'default');
const isDefault = computed(() => actualVariation.value === 'default');
const isQuote = computed(() => actualVariation.value === 'quote');
const isOther = computed(() => actualVariation.value === 'other');
const store = useStore();
const randomMultiplier = Math.ceil(Math.random() * 2);

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