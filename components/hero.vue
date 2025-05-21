<template>
  <div class="hero-bg bg-zaffre text-white p-4 h-screen w-screen md:px-24 flex flex-col justify-start items-start">
    <div class="md:w-7/10 my-8 title">
      <h1 class="text-4xl md:text-7xl font-black my-5">CELEBRATING 100 Years</h1>
      <p class="text-lg md:w-2/3"> Over the past 100 years, we’ve transformed how local people and organizations mobilize to drive positive change. Founded in 1925 by two Hartford bankers, we began with a vision: to create a community-wide charitable endowment that would accept “gifts, devises, and bequests” and serve as a trustworthy, steadfast, and responsive resource—forever.
        Our timeline offers you a front-row seat to the moments that shaped the Foundation’s storied history and showcases how our donors, nonprofit partners, volunteers, and staff have come together for good. Scroll through to explore key events, and engage with our history through photographs, audio, and video.</p>
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
  /* background-size: cover; */
  background-position: 50% 150%;
  background-size: 100% 100%;
  /* background: linear-gradient(rgb(0, 0, 1, 0.1), rgb(0, 0, 1, 0.1)); */
}

@media screen and (max-width: 768px) {
  .hero-bg {
    background-size: 200% 160%;
    background-repeat: no-repeat;
    background-position: 20% 0%;
  }
  
}
</style>