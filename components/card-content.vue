<template>
  <div class="text-content">
    <div class="flex flex-col gap-2 px-8 py-4 text-left feature-content grow dark:bg-gray-800">
      <p class=" font-bold text-sm md:text-xl">{{ props?.post?.eventOptions?.eventYear }}</p>
      <p class="text-xl md:text-2xl font-black">{{ props?.post?.title }}</p>
      <p class="font-light text-sm h-full line-clamp-3 overflow-hidden teaser">
        {{ props?.post?.eventOptions?.teaser ? props?.post?.eventOptions?.teaser : snippet }}
      </p>

    </div>
    <div class="h-12 bottom-0 right-0 left-0 absolute gradient-default pointer-events-none" />
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
const props = defineProps<{
  post: Post
}>();

const snippet = extractFirstParagraph(props?.post?.eventOptions?.content);


function extractFirstParagraph(htmlText: string) {
  if(!htmlText) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const firstP = doc.querySelector('p');
  return firstP ? firstP.textContent.trim() : '';
}

const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie, neque non scelerisque ultricies.`;
const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};


</script>



<style scoped>

.gradient-default {
  background: linear-gradient(180deg, transparent 0%, #ffffffd9 80%);
}


</style>