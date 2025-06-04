<template>
  <div data-aos="fade-left" data-aos-duration="000" class="w-7/8 md:w-full mb-36 mx-auto justify-center flex align-center z-50 ">
    <div class="bg-gray-500 md:rounded-4xl md:w-5/6 w-screen h-1/3 md:h-200 mx-4 lg:mx-36 md:my-24 grid place-content-center p-24 sm:mt-56">
      <p class=" text-xl md:text-5xl font-bold text-white mx-36">Centennial Welcome Intro Animation</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs'
import { onMounted } from 'vue'

onMounted(() => {
  anime({
    targets: '.bg-gray-500',
    translateY: 50,
    duration: 800
  })
})
</script>

<style></style>