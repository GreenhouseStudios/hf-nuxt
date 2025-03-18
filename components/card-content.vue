<template>
    <div class="flex flex-col gap-2 px-8 py-4 text-left hover:bg-gray-200 feature-content grow">
      <p class="text-base font-bold text-2xl">2020</p>
      <p class="text-2xl font-bold">TITLE</p>
      <p class=" h-full">
        <!-- {blok.description} -->
        <!-- {{fillerText(loremFragment, Math.floor(Math.random() * 2) + 1)}} -->
        {{fillerText(loremFragment, 1)}}
      </p>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie, neque non scelerisque ultricies.`;
const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};
</script>

<style lang="scss" scoped>

</style>