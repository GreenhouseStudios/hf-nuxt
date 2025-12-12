<template>

  <div class="hero-bg-vid text-white flex flex-col relative justify-start items-start">

    <div class="vid-wrap-bg">

      <Hero-Vid ref="vidElRef" />

    </div>
    <div class="hero-bg-overlay">

      <div class="hero-bg-text ani md:w-8/10 lg:w-8/10 my-2 mx-4 md:mx-24 z-50">

        <h1 class="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black title text-md mb-4 pt-5">CELEBRATING 100 YEARS</h1>
        <p class="md:text-lg md:w-1/1 mt-9 xl:w-3/4 2xl:w-2/3 text-md"> Over the past 100 years, we’ve transformed how local people and
          organizations mobilize to drive positive change. Founded in 1925 by two Hartford bankers, we began with a
          vision: to create a community-wide charitable endowment that would accept “gifts, devises, and bequests” and
          serve as a trustworthy, steadfast, and responsive resource—forever.
          Our timeline offers you a front-row seat to the moments that shaped the Foundation’s storied history and
          showcases how our donors, nonprofit partners, volunteers, and staff have come together for good.</p>
        <!-- <img src="../public/hero_curve_banner.png" alt=""> -->
      </div>

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



</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import HeroVid from "~/components/hero-vid.vue";
import { nextTick } from "vue";

let gsapDisabled = false;

gsap.registerPlugin(ScrollTrigger)

let triggers: ScrollTrigger[] = [];

const vidElRef = ref<InstanceType<typeof HeroVid> | null>(null)

onMounted(async () => {
  await nextTick();
  const overlay = document.querySelector<HTMLElement>('.hero-bg-overlay');
  const hero    = document.querySelector<HTMLElement>('.hero-bg-vid');

  if (!overlay || !hero) return;

  const video = vidElRef.value?.vidEl;



  // Keep CSS var in sync with overlay height
  const setOverlayH = () => {
    const h = overlay.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--overlay-h', `${h}px`);
  };
  setOverlayH();
  const ro = new ResizeObserver(setOverlayH);
  ro.observe(overlay);
  // INITIAL STATES
  // video hidden behind overlay to start

  // Entrance animations
/*  gsap.fromTo('.hero-bg-text',
      { yPercent: -150, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.75, ease: 'power1.out', delay: 0.4 }
  );*/

let vidAniDone = false;
  // Main hero pin + motions
  const heroTl = gsap.timeline({
    defaults: { ease: 'power1.out' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=125%',
      pin: true,
      scrub: true,
      markers: false,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: self => {
        if(self.progress > .6) {
          if(window.innerWidth > 1150 && !vidAniDone) lockScroll();
          else if(!vidAniDone && video) {
            console.log(video)
            video.play()
            vidAniDone = true;
          }
        }
      }
    }
  });

  const bgText = overlay.querySelector<HTMLElement>('.hero-bg-text')

  video?.addEventListener('ended', () => {
    const st = heroTl.scrollTrigger;


    if(st) {
      if(window.innerWidth > 1150) {
        st.kill(true);
        if(bgText) bgText.style.position = 'relative';
      } else {
        st.vars.end = '+=75%';
        st.refresh();
      }
    }
  })




  bgText?.addEventListener('animationend', () => {
    heroTl
        .to('.hero-bg-overlay', { yPercent: -100 }, 0)  // overlay slides up/out
        .to('.hero-bg-text',    { yPercent: -100 },  0)  // text moves up
  }, {once: true})


  function lockScroll() {
    vidAniDone = true;
    document.body.style.overflow = 'hidden';
  }


  // Move vid off-screen
  const visionTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.three-key-blocks',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      invalidateOnRefresh: true
    }
  });

  triggers.push(heroTl.scrollTrigger!, visionTl.scrollTrigger!);

  // Start vid on scroll down


  window.addEventListener('resize', sizeHeader);
  sizeHeader();


  function sizeHeader() {
    if(window.innerWidth < 740) {
      if(!overlay) return;
      gsapDisabled = true;
      overlay.classList.add('hide');
      triggers.forEach(t => t?.kill());
    } else if(gsapDisabled) {
      if(!overlay) return;
      gsapDisabled = false;
      overlay?.classList.remove('hide');

      const heroTl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: true,
          markers: false,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      heroTl
          .to('.hero-bg-overlay', { yPercent: -100 }, 0)  // overlay slides up/out
          //.to('.hero-bg-text',    { yPercent: -100 }, 0)  // text moves up


      // Move vid off-screen
      const visionTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.three-key-blocks',
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      triggers.push(heroTl.scrollTrigger!, visionTl.scrollTrigger!);

    }
  }

});



onBeforeUnmount(() => {
  triggers.forEach(t => t?.kill());
  gsap.killTweensOf('.hero-bg-overlay');
  gsap.killTweensOf('.hero-bg-text');
});
</script>

<style>

.hero-bg-overlay.hide {
  background: none;
}

.vid-bg {
  width: 100%;
  height: 100%;
  position: relative;
  box-shadow: 0px 5px 17px 4px #000d2561;
  transition: opacity .25s;
}
.hero-bg-vid {
  background-image: url("../public/hf-hero-bg-light.svg");
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
  height: 100vh;
}
:root {
  --overlay-h: 0px; /* set dynamically in JS */
  --parkSpeed: .5s;
}

.vid-wrap-bg {
  position: fixed;
  width: 100%;
  height: calc(100% - 80px);
  left: 0;
  bottom: 0;
  z-index: 97;
  pointer-events: none;
}

.hero-bg-text {
  position: sticky;
  top: 100px;
  opacity: 1;
  transform: translateY(-150%);
  will-change: transform;
}

.hero-bg-text.ani {
  animation: text-ani-in .5s ease-out .25s forwards;
}

@keyframes text-ani-in {
  from {transform: translateY(-150%)}
  to {transform: translateY(0)}
}

@media screen and (max-width: 768px) {
  .hero-bg-text {
    top: 80px;
  }
  .hero-bg {
    height: 1000px;
  }
}

.hero-bg-overlay {
  background-image: url("../public/hero-curve-banner.png");
  background-size: cover;
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

@media(max-width: 1150px) {
  .info-line {
    width: 75% !important;
    height: 2px !important;
    background: linear-gradient(90deg, #3093FE 0%, #FFFFFF 100%) !important;
    margin: auto 5px;
  }
  .three-key-blocks {
    background-size: 125% 125% !important;
  }
  .info-container {
    flex-direction: column;
    padding-top: 15px;
    height: 55% !important;
  }
  .info-text-block {
    padding: 0 10px
  }
  .info-text-block > p {
    margin: 10px auto 10px auto !important;
    max-width: 80% !important;
  }
  .vid-wrap-bg {
    width: 90% !important;
    height: auto;
    border-radius: 25px;
    overflow: hidden;
    left: 50%;
    transform: translateX(-50%) translateY(50%);
    bottom: 50%;
  }
}

@media(max-width: 725px) {
  .three-key-blocks {
    background-size: 135% 145% !important;
  }
  .info-container {
    height: 65% !important;
  }
  .vid-wrap {
    width: 75vw !important;
  }
}

@media(max-width: 540px) {
  .hero-bg-text > h1 {
    text-align: center !important;
  }
  .vid-wrap {
    top: 60% !important;
  }
  .info-container {
    height: 70% !important;
  }
  .three-key-blocks {
    height: 125vh !important;
    background: linear-gradient(180deg, #131d8f 0%, #0043AA 70%, transparent 95%) !important;
  }
}
</style>