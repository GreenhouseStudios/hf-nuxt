<template>
  <div class="w-full mb-24 md:mx-auto justify-center flex align-center">
     <!-- <video src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.mp4" autoplay loop
      muted class="bg-gray-500 md:rounded-4xl w-1/2 h-1/3 md:w-5/6 md:h-200 mx-4 lg:mx-36 md:my-24">
      <source src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.mp4" type="video/mp4">
      <source src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.webm" type="video/webm">
      Your browser does not support the video tag.
    </video> -->
    <div class="bg-gray-500 md:rounded-4xl md:w-5/6 w-screen h-1/3 md:h-200 mx-4 lg:mx-36 md:my-24 grid place-content-center p-24">
      <p class="text-5xl font-bold text-white mx-36">Centennial Welcome Intro Animation</p>
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