<template>
    <div class="flex flex-col gap-2 px-8 py-4 text-left hover:bg-lavender feature-content grow dark:bg-gray-800">
      <p class=" font-bold text-xl">{{props?.post?.cardOptions?.year}}</p>
      <p class="text-2xl font-black">{{props?.post?.title}}</p>
      <p class=" h-full font-light">
        {{props?.post?.cardOptions?.cardDescription}}
      </p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  post: Post
}>();
import { ref, computed } from 'vue';

const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie, neque non scelerisque ultricies.`;
const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};
</script>

<style lang="scss" scoped>

</style>