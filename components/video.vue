<template>
  <div class="bg-gray-500 rounded-4xl w-1/2 h-1/3 md:w-5/6 md:h-200 md:mx-36 md:my-24">
    
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

<style>

</style>