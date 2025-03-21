<template>
    <div class="flex flex-col gap-2 px-8 py-4 text-left bg-cetacean text-white feature-content shrink">
      <p class="grid items-center h-full italic text-2xl">
        "{{props.post.cardOptions.cardDescription}}"
      </p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  post: any;
}>();
import { ref, computed } from 'vue';
const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie, neque non scelerisque ultricies.`;
const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};
</script>

<style lang="scss" scoped>

</style>