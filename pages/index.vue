<template>
  <div>
    <Hero />
    <img src="../public/curve_banner.png" alt="curve banner">
    <Timeline />

    <BlockRow class="my-24 px-12">
      <Block class="text-center">
        <h1 class="text-3xl font-bold text-blue-500 dark:text-blue-200">How We Started</h1>
        <h2 class="text-blue-950 dark:text-blue-300">“Health Council Opens Center on Hispanics,” The Hartford Courant Dec. 22, 1980</h2>

        <h3 class="text-blue-950 dark:text-blue-300">1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated
          society
          in Hartford's North End until the Interracial Scholarship Fund gave him a chance to meet people of other
          cultures.
          Art school at UHart</h3>
      </Block>
      <VerticalDivider />
      <Block class="text-center">
        <h1 class="text-3xl font-bold text-blue-500 dark:text-blue-200">Key Highlights</h1>
        <h2 class="text-blue-950 dark:text-blue-300">“Health Council Opens Center on Hispanics,” The Hartford Courant Dec. 22, 1980</h2>

        <h3 class="text-blue-950 dark:text-blue-300">1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated
          society
          in Hartford's North End until the Interracial Scholarship Fund gave him a chance to meet people of other
          cultures.
          Art school at UHart</h3>
      </Block>
      <VerticalDivider />
      <Block class="text-center">
        <h1 class="text-3xl font-bold text-blue-500 dark:text-blue-200">How We Started</h1>
        <h2 class="text-blue-950 dark:text-blue-300">“Health Council Opens Center on Hispanics,” The Hartford Courant Dec. 22, 1980</h2>

        <h3 class="text-blue-950 dark:text-blue-300">1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated
          society
          in Hartford's North End until the Interracial Scholarship Fund gave him a chance to meet people of other
          cultures.
          Art school at UHart</h3>
      </Block>
    </BlockRow>
  </div>
</template>

<script lang="ts" setup>
import Hero from '~/components/hero.vue';
import anime from 'animejs';
import { onMounted } from 'vue';

onMounted(() => {
  anime({ targets: '.text-center', opacity: [0,1], duration: 700 });
});

</script>

<style></style>