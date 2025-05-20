<template>
    <div class="flex flex-col gap-2 px-8 py-4 text-left bg-cetacean text-white feature-content grow"  @mouseleave="hovered = false" @mouseenter="hovered = true">
      <p class="grid place-content-center items-center h-full w-56 italic text-2xl my-24" v-if="!hovered">
        "{{props.post?.cardOptions?.cardDescription || fillerText(loremFragment, 1)}}"
      </p>
      <p class="grid place-content-center items-center h-full w-56 italic text-2xl my-24" v-else>
        –{{props.post?.cardOptions?.quoteAuthor}}
      </p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  post: Post,
}>();
import { ref, computed } from 'vue';

let hovered = ref(false)

const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};

</script>

<style lang="scss" scoped>

</style>