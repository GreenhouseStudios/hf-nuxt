<template>

  <div class="hero-bg text-white flex flex-col relative justify-start items-start">
    <div class="hero-bg-overlay">
      <div class="hero-bg-text md:w-7/10 my-2 mx-4 md:mx-24 z-50">

        <h1 class="text-4xl md:text-7xl font-black title text-md mb-4 pt-5">CELEBRATING 100 YEARS</h1>
        <p class="md:text-lg md:w-2/3 text-sm"> Over the past 100 years, we’ve transformed how local people and
          organizations mobilize to drive positive change. Founded in 1925 by two Hartford bankers, we began with a
          vision: to create a community-wide charitable endowment that would accept “gifts, devises, and bequests” and
          serve as a trustworthy, steadfast, and responsive resource—forever.
          Our timeline offers you a front-row seat to the moments that shaped the Foundation’s storied history and
          showcases how our donors, nonprofit partners, volunteers, and staff have come together for good.</p>
        <!-- <img src="../public/hero_curve_banner.png" alt=""> -->
      </div>

    </div>
<!--    <Video />-->
    <div class="vid-wrap">
      <video class="vid" src="../public/HF_LOGO.mp4" type="video/mp4"
      muted
      preload="auto"
      playsinline
      ></video>
    </div>
  </div>
  <div class="three-key-blocks">
    <div class="info-container">
      <div class="info-text-block">
        <h2>HOW WE STARTED</h2>
        <p>1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated society in Hartford's North Fund gave him a chance to meet people
          of other cultures. Art school at UHart
        </p>
      </div>
      <div class="info-line"></div>
      <div class="info-text-block">
        <h2>KEY HIGHLIGHTS</h2>
        <p>1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated society in Hartford's North Fund gave him a chance to meet people
          of other cultures. Art school at UHart
        </p>
      </div>
      <div class="info-line" style="transform-origin: top; transform: scaleY(1.3)"></div>
      <div class="info-text-block">
        <h2>KEY CONTRIBUTORS</h2>
        <p>1998: Jonathan Bruce, the 49-year-old director of The Craftery Gallery in Hartford,
          lived in a segregated society in Hartford's North Fund gave him a chance to meet people
          of other cultures. Art school at UHart
        </p>
      </div>
    </div>
  </div>
  <!-- <div class="bg-zaffre text-white h-screen p-4 relative">
      <span ref="demo" class="demo sticky top-0 left-0">
        Intersection Observer in Action 👌
      </span>
    </div> -->


</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, nextTick, onBeforeUnmount } from 'vue'
import anime from 'animejs'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'


gsap.registerPlugin(ScrollTrigger)

let triggers: ScrollTrigger[] = [];


onMounted(() => {


  gsap.fromTo('.hero-bg-text',
      {yPercent: -150, opacity: 0},
      {yPercent: 0, opacity: 1, duration: .75, ease: 'power1.out', delay: .5}
  )

  gsap.fromTo('.vid-wrap',
      {yPercent: -100, opacity: 0},
      {yPercent: -50, opacity: 1, duration: .75, ease: 'power1.out', delay: .5}
  )

  gsap.from('.hero-bg-text', {
    y: 0,
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.hero-bg-text',
      start: '300 top',
      toggleActions: 'play none none reverse',
    }
  })

  gsap.set('.hero-bg-overlay', {yPercent: 0, willChange: 'transform'})
  gsap.set('.hero-bg-text', {y: 0, autoAlpha: 1, willChange: 'transform,opacity'})
  gsap.set('.vid-wrap', {xPercent: -50, yPercent: -75, willChange: 'transform'})

  const heroTl = gsap.timeline({
    defaults: {ease: 'power1.out'},
    scrollTrigger: {
      trigger: '.hero-bg',
      start: 'top top',
      end: '+=125%',
      pin: true,
      scrub: true,
      markers: true,
      invalidateOnRefresh: true
    }
  })

  heroTl
      // overlay slides up and away
      .to('.hero-bg-overlay', {yPercent: -100}, 0)
      // hero text fades + moves up
      .to('.hero-bg-text', {y: -80, autoAlpha: 0}, 0.0)
      // vid comes from bottom to center
      .to('.vid-wrap', {yPercent: -40}, 0.0)

  triggers.push(heroTl.scrollTrigger!)

  const visionTl = gsap.timeline({
    defaults: {ease: 'none'},
    scrollTrigger: {
      trigger: '.three-key-blocks',
      start: 'top bottom',   // when vision enters viewport bottom
      end: 'top top',        // until its top hits the top
      scrub: true,
      invalidateOnRefresh: true
    }
  })

  visionTl.to('.vid-wrap', {yPercent: -120})

  triggers.push(visionTl.scrollTrigger!)

  const video = document.querySelector('.vid') as HTMLVideoElement | null;
  let videoStarted = false;
  document.addEventListener('wheel', (event) => {
    if(event.deltaY > 0 && !videoStarted && video) {
      videoStarted = true;
      video.loop = false;
      video.play()
    }
  })


})

onBeforeUnmount(() => {
  // clean up
  triggers.forEach(t => t?.kill())
  gsap.killTweensOf('.hero-bg-overlay')
  gsap.killTweensOf('.hero-bg-text')
  gsap.killTweensOf('.vid')
})
</script>

<style>

.vid-wrap {
  position: fixed;
  width: 800px;
  height: fit-content;
  top: 50%;
  left: 50%;
  z-index: 97;
  pointer-events: none;
  transform: translate(-50%, -50%);
}
.vid {
  width: 100%;
  height: auto;
  border-radius: 25px;
  position: relative;
  box-shadow: 0px 5px 17px 4px #000d2561;
  transition: opacity .25s;
}
.hero-bg {
  position: relative;
  background-image: url("../public/hf-hero-bg-light.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
  height: 100vh;
}

.hero-bg-fixed {
  height: 100%;
  width: 100vw;
  position: absolute;
  top: 50px;
  right: 0;
  background-image: url("../public/hf-hero-bg.svg");
  background-repeat: no-repeat;
  background-size: cover;
}

.hero-bg-text {
  position: sticky;
  top: 150px;
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .hero-bg-text {
    top: 20px;
  }
  .hero-bg {
    height: 1000px;
  }
}

.hero-bg-overlay {
  background-image: url("../public/hero.png");
  background-size: 100% 100%;
  position: absolute;
  inset: 0;
  height: 100%;
  z-index: 98;
}


.three-key-blocks {
  height: 100vh;
  background-image: url("../public/vision-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-bottom: -10%;
}
.info-container {
  height: 50%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
.info-text-block {
  padding: 10px;
  text-align: center;
  color: white;
}
.info-text-block > h2 {
  font-weight: 900;
  font-size: xx-large;
}
.info-text-block > p {
  max-width: 70%;
  margin: 10px auto 0 auto;
}
.info-line {
  width: 3px;
  height: 65%;
  background: linear-gradient(180deg, #3093FE 0%, #FFFFFF 100%);
  opacity: .5;
  transform-origin: top;
}


.animate-delay {
  animation-duration: 0.5s;
  animation-fill-mode: both;
  animation-name: animate-delay;
}

@keyframes animate-delay {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.demo {
  /* display: inline-block; */
  opacity: 0;
  transform: translateY(10px);
}
</style>