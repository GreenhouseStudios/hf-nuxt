<template>
  <div class="hero-bg bg-zaffre text-white p-4 h-screen w-screen md:px-24 flex flex-col justify-start items-start">
    <div class="md:w-7/10 my-24 title">
      <h1 class="text-4xl md:text-7xl font-black my-5">CELEBRATING 100 Years</h1>
      <p class="text-lg md:w-2/3">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non, vitae iure. Fuga numquam eum
        libero sint repellat vitae aliquam suscipit laborum? Dicta deserunt ad aliquid delectus tenetur eum, praesentium
        eligendi?</p>
        <!-- <img src="../public/hero_curve_banner.png" alt=""> -->
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import anime from 'animejs'

onMounted(() => {
    anime({ targets: '.title', translateX: [-100,0], duration: 800 })
  })
</script>

<style>
.hero-bg{
  background-image: url('../public/hero_curve_banner.png');
  background-size: cover;
  background-position: 50% 40%;
  /* background: linear-gradient(rgb(0, 0, 1, 0.1), rgb(0, 0, 1, 0.1)); */
}</style>