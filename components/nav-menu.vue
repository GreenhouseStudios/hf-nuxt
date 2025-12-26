<style scoped>

  li.text-active {
    color: #0a7aff;
  }
</style>

<template>
  <ul>
    <li
      v-for="item in props.items"
      :key="item.sectionID"
      :class="[
          'font-normal text-sm cursor-pointer hover:text-gray-500',
        {
          'text-active': item.active,
        }
      ]"
      @click="scrollToSection(item.sectionID)"
    ><span>{{item.label}}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">

import {useNuxtApp} from "#imports";

const { $gsap } = useNuxtApp();

const props = defineProps<{
  items: NavItem[]
}>()


const scrollToSection = (sectionID: string) => {
  const section = document.getElementById(sectionID);
  if(!section) return;
  $gsap.to(window, {
    duration: .75,
    ease: 'power1.inOut',
    scrollTo: {
      y: section,
      offsetY: 100,
    },
  })
}



</script>
