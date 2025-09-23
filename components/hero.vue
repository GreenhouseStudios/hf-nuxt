<template>

  <div class="hero-bg text-white flex flex-col relative justify-start items-start my-1">
    <div class="hero-bg-overlay">
      <div class="hero-bg-text md:w-7/10 my-2 mx-4 md:mx-24 z-50 animate-me" data-aos="fade-up">

        <h1 class="text-4xl md:text-7xl font-black title text-md mb-4">CELEBRATING 100 YEARS</h1>
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
    <div class="vid"></div>
  </div>
  <!-- <div class="bg-zaffre text-white h-screen p-4 relative">
      <span ref="demo" class="demo sticky top-0 left-0">
        Intersection Observer in Action 👌
      </span>
    </div> -->


</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, nextTick } from 'vue'
import anime from 'animejs'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const demo = useTemplateRef('demo')

onMounted(() => {

  gsap.registerPlugin(ScrollTrigger)

  gsap.from('.hero-bg-text', {
    y: 70,
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
      trigger: '.hero-bg-text',
      start: '300 top',
      toggleActions: 'play none none reverse',
    }
  })

  anime({ targets: '.title', translateX: [150, 0], duration: 800 })

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-delay');
        }
      }
    },
    {
      threshold: 0.5,
    }
  );

  if (demo.value) {
    observer.observe(demo.value as Element);
  }
})
let prevScrollY = window.scrollY;
let heroAnimated = false;


window.addEventListener('scroll', async (e) => {
  if(window.scrollY >= 250 && !heroAnimated) {
    await nextTick();
    const heroOverlay = document.querySelector('.hero-bg-overlay');
    const vid = document.querySelector('.vid');

    console.log('scroll down');
    if(!heroOverlay || !vid) return;
    heroOverlay.style.transform = 'translateY(-100%)';
    vid.style.transform = 'translateX(-50%) translateY(-50%)'
    prevScrollY = window.scrollY;
    heroOverlay.addEventListener('transitionend', bgUpComplete);
  } else if(heroAnimated && window.scrollY < 300 && prevScrollY > 300) {
    if (!heroAnimated) return;
    await nextTick();
    const heroOverlay = document.querySelector('.hero-bg-overlay');
    const vid = document.querySelector('.vid');

    if (!heroOverlay || !vid) return;
    heroAnimated = false;
    console.log('up')
    heroOverlay.style.transform = '';
    vid.style.transform = '';
  }
  prevScrollY = window.scrollY;
  //console.log(window.scrollY)
})
window.addEventListener('wheel', async(e) => {
  if(window.scrollY < 250 && heroAnimated && e.deltaY < 0) {
    await nextTick();
    console.log('wheel up')
    const heroOverlay = document.querySelector('.hero-bg-overlay');
    const vid = document.querySelector('.vid');

    if (!heroOverlay || !vid) return;
    heroAnimated = false;
    console.log('up')
    heroOverlay.style.transform = '';
    vid.style.transform = '';
  }
})

async function bgUpComplete() {
  await nextTick();
  const bgOverlay = document.querySelector('.hero-bg-overlay');
  if(!bgOverlay) return;

  bgOverlay.removeEventListener('transitionend', bgUpComplete);
  heroAnimated = true;
}
async function bgDownComplete() {
  await nextTick();
  const bgOverlay = document.querySelector('.hero-bg-overlay');
  if(!bgOverlay) return;

  bgOverlay.removeEventListener('transitionend', bgDownComplete);
  heroAnimated = false;
}


</script>

<style>

.vid {
  position: fixed;
  width: 400px;
  height: 300px;
  background-color: grey;
  top: 50%;
  left: 50%;
  z-index: 98;
  transform: translatex(-50%) translateY(15%);
  transition: transform .75s ease-out;
}

.hero-bg {
  overflow-x: clip;
  background-color: #111A36;
  height: 175vh;

}

.hero-bg-text {
  position: sticky;
  top: 75px;
}

@media screen and (max-width: 768px) {
  .hero-bg-text {
    top: 20px;
  }
  .hero-bg {
    height: 1000px;
  }
}

@media screen and (min-width: 1440px) {
/*  .hero-bg {
    height: 2500px;
  }*/
  
}

.hero-bg-overlay {
  background-image: url("../public/hero.png");
  background-size: 100%;
  position: absolute;
  height: 100vh;
  top: 0;
  z-index: 99;
  left: 0;
  transition: transform .75s ease-out;
}

@media screen and (max-width: 768px) {
  .hero-bg {
    background-size: 200% 160%;
    background-repeat: no-repeat;
    background-position: 20% 0%;
  }

}

@media screen and (max-width: 1440px) {
  .hero-bg {
    background-size: 206% 200%;
    background-repeat: no-repeat;
    background-position: 50% 0%;
  }

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