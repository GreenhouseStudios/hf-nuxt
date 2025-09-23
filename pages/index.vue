<style>
  .timeline-img-ani {
    transition: transform .75s ease-in-out, opacity .5s !important;
    transform: translateX(0) !important;
    opacity: 1 !important;
}
  .vision-head {
    height: 100vw;
    background-size: 100%;
    background-image: url("../public/vision-bg.png");
  }
</style>
<template>
  <div>
    <Hero />
    <div class="vision-head">
      <h2>AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH</h2>
    </div>


<!--    <img src="../public/curve_banner.png" id="timeline-img"
      style="width: 100%; opacity: 0; will-change: transform"
      alt="curve banner">-->
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
import { onMounted, nextTick } from 'vue';

onMounted(async ()  =>  {
  anime({ targets: '.text-center', opacity: [0,1], duration: 700 });
  await nextTick()
  const timelineImg = document.querySelector('#timeline-img');
  if(!timelineImg) {
    return;
  }
  await nextTick()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
      timelineImg.style.transition = 'transform .05s';
      timelineImg.style.transform = 'translateY(-100%)';
      timelineImg.addEventListener('transitionend', () => {
        setTimeout(() => {
          requestAnimationFrame(() => timelineImg.classList.add('timeline-img-ani'));
        }, 250)
      }, {once:true})
      observer.unobserve(timelineImg)
      }

    });
  }, {threshold: .2});
  observer.observe(timelineImg);
});

</script>

<style></style>