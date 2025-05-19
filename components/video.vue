<template>
  <div class="my-24 mx-auto justify-center flex"> <video src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.mp4" autoplay loop
      muted class="bg-gray-500 md:rounded-4xl w-1/2 h-1/3 md:w-5/6 md:h-200 mx-4 lg:mx-36 md:my-24">
      <source src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.mp4" type="video/mp4">
      <source src="https://videos.pexels.com/video-files/3129576/3129576-uhd_2560_1440_30fps.webm" type="video/webm">
      Your browser does not support the video tag.
    </video>
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