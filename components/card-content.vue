<template>
  <div class="hover:bg-lavender max-h-72">
    <div class="flex flex-col gap-2 px-8 py-4 text-left feature-content grow dark:bg-gray-800">
      <p class=" font-bold text-xl">{{ props?.post?.cardOptions?.year }}</p>
      <p class="text-2xl font-black">{{ props?.post?.title }}</p>
      <p class="font-light h-full line-clamp-3 overflow-hidden">
        {{ props?.post?.cardOptions?.cardDescription }}
      </p>

    </div>
    <div class="bg-gradient-to-t from-gray-50 to-transparent absolute h-12 bottom-0 right-0 left-0">
    </div>
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

<style lang="scss" scoped></style>