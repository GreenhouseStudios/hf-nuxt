<template>
  <div class="flex flex-col gap-2 px-8 py-4 text-left bg-cetacean w-full text-white feature-content grow h-121"
    @mouseleave="hovered = false" @mouseenter="hovered = true">
    <transition name="fade" mode="out-in" v-if="!hovered" key="hover">
      <p class="grid place-content-center items-center h-full italic w-full text-2xl my-24" id="quote" >
        "{{ props.post?.cardOptions?.cardDescription || fillerText(loremFragment, 1) }}"
      </p>
    </transition>
    <transition name="fade" v-else key="default">
      <p class="grid place-content-center items-center h-full italic w-full text-2xl my-24" id="quote-author" >
        –{{ props.post?.cardOptions?.quoteAuthor }}
      </p>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs'
const props = defineProps<{
  post: Post,
}>();

import { ref, computed } from 'vue';

let hovered = ref(false)

const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

const fillerText = (text: string, multiplier: number) => {
  return text.repeat(multiplier);
};

onMounted(() => {
  anime({ targets: '#quote #quote-author', opacity: [0, 1], loop: true, duration: 800 })
})

</script>

<style lang="scss" scoped></style>