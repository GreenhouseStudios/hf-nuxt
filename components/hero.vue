<template>

  <div class="hero-bg text-white flex flex-col relative justify-start items-start" ref="heroBgEl" >

    <div class="vid-wrap-bg" ref="vidWrapEl">

      <Hero-Vid ref="vidEl" v-if="!isMobile"/>

    </div>
    <div class="hero-bg-overlay" ref="heroOverlayEl">

      <div class="hero-bg-text ani w-11/12 md:w-9/10 lg:w-8/10 my-2 mx-auto mx-4 md:mx-24 z-50" ref="heroTextEl">

        <h1 class="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black title text-md mb-4 pt-5">CELEBRATING 100 YEARS</h1>
        <p class="md:text-lg md:w-1/1 mt-9 xl:w-3/4 2xl:w-2/3 text-md"> Over the past 100 years, we’ve transformed how local people and
          organizations mobilize to drive positive change. Founded in 1925 by two Hartford bankers, we began with a
          vision: to create a community-wide charitable endowment that would accept “gifts, devises, and bequests” and
          serve as a trustworthy, steadfast, and responsive resource—forever.
          Our timeline offers you a front-row seat to the moments that shaped the Foundation’s storied history and
          showcases how our donors, nonprofit partners, volunteers, and staff have come together for good.</p>
        <!-- <img src="../public/hero_curve_banner.png" alt=""> -->
      </div>

      <div class="vid-wrap-mobile" v-if="isMobile" ref="vidMobileWrapEl">
        <video
            class="hero-vid"
            ref="vidMobileEl"
            src="../public/HF_LOGO.mp4"
            type="video/mp4"
            muted
            preload="auto"
            playsinline
            style="object-fit: cover; width: 100%; height: 100%"
        >
        </video>
      </div>


    </div>

    <AboutTimeline id="about" />

  </div>
  </template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import HeroVid from '~/components/hero-vid.vue'
import AboutTimeline from "~/components/about-timeline.vue";
const width = ref(window.innerWidth)

const isMobile = computed(() => width.value < 768)

function onResize() {
  width.value = window.innerWidth
}



gsap.registerPlugin(ScrollTrigger)

const vidEl = ref<InstanceType<typeof HeroVid> | null>(null)
const vidMobileWrapEl = ref<HTMLElement | null>(null);
const vidWrapEl = ref<HTMLElement | null>(null);

let mm: gsap.MatchMedia | null = null

const heroBgEl = ref<HTMLElement | null>(null);
const heroOverlayEl = ref<HTMLElement | null>(null);
const heroTextEl = ref<HTMLElement | null>(null)


onMounted(async () => {
  await nextTick()


  await nextTick();
  console.log(heroBgEl.value)

  const video = vidEl.value?.vidEl ?? null

  // Keep CSS var in sync with overlay height (regardless of breakpoint)
  const setOverlayH = () => {
    const h = heroOverlayEl.value?.getBoundingClientRect().height
    document.documentElement.style.setProperty('--overlay-h', `${h}px`)
  }
  setOverlayH()
  const ro = new ResizeObserver(setOverlayH)
  //ro.observe(heroOverlayEl.value)

  // If you still need this


  window.addEventListener('resize', onResize)

  let vidAniDone = false;

  function lockScroll(tl: gsap.core.Timeline) {
    vidAniDone = true
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      onEnded(tl);
    }, 250)
  }

  const isMobile = computed(() => window.innerWidth < 768)

  mm = gsap.matchMedia()

  // <= 740px: disable visuals + ensure any running trigger is gone
  mm.add('(max-width: 740px)', () => {
    const overlay = heroOverlayEl.value
    const text = heroTextEl.value
    overlay?.classList.add('hide')

    gsap.set([overlay, text], { clearProps: 'transform' })

    return () => overlay?.classList.remove('hide')
  })


  // > 740px: create ScrollTrigger + timeline, auto-killed when resizing down
  mm.add('(min-width: 741px)', () => {
    const hero = heroBgEl.value
    const overlay = heroOverlayEl.value
    const text = heroTextEl.value
    if (!hero || !overlay || !text) return

    // make sure sticky isn't active on desktop
    gsap.set([overlay, text], { clearProps: 'position,top' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: window.innerWidth <= 1150 ? '+=175%' : '+=120%',
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if(!vidAniDone) {
            if(heroOverlayEl.value) {
              const rect = heroOverlayEl.value.getBoundingClientRect();
              if(window.innerWidth > 1150) {
                console.log(rect.bottom)
                if(rect.bottom <= 400) {
                  lockScroll(tl)
                }
              } else {
                if(!vidWrapEl.value) return;
                const vidRect = vidWrapEl.value.getBoundingClientRect();
                if(rect.bottom < vidRect.top - 25) {
                  video?.play();
                  vidAniDone = true;
                }
              }
            }
          }


        }
      }
    })

    tl.to(overlay, { yPercent: -100, ease: 'none' }, 0)
    if (window.innerWidth <= 1150 && vidWrapEl.value) {
      gsap.set(vidWrapEl.value, { yPercent: 15 })

      tl.to(
          vidWrapEl.value,
          { yPercent: 30, ease: "none" },
          0
      )
      tl.to(
          vidWrapEl.value,
          { yPercent: 30, ease: 'none' },
          .35
      )

    }
    return () => {
      tl.scrollTrigger?.kill(true)
      tl.kill()
      gsap.set([overlay, text], { clearProps: 'transform' })
    }
  })


  const onEnded = (tl: gsap.core.Timeline | null) => {
    const st = tl?.scrollTrigger

    if (!st) return

    if (window.innerWidth > 1150) {
      st.kill(true)
      if (heroTextEl.value) heroTextEl.value.style.position = 'relative'
    } else if (window.innerWidth > 740) {
      st.vars.end = '+=50%'
      st.refresh()
    }
  }


})

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
.hero-bg {
  position: relative;
  min-height: 150vh;
  background:
      linear-gradient(transparent, transparent) no-repeat top / cover,
      url('/hf-hero-bg-curve.svg') no-repeat top / 130% auto;
}
:root {
  --overlay-h: 0px;
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

.vid-wrap-mobile {
  position: sticky;
  width: 97% !important;
  height: auto;
  margin: auto auto 25px;
  border-radius: 25px;
  overflow: hidden;
  top: 50%;
}

.hero-bg-text {
  position: relative;
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

}

.hero-bg-overlay {
  background-image: url("../public/hero-curve-banner.png");
  background-size: cover;
  inset: 0;
  height: 120vh;
  z-index: 98;
  position: relative;
  will-change: transform;
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

@media(max-width: 1700px) {
  .hero-bg {
    height: 100vh
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
  .vid-wrap-bg, .vid-wrap-mobile {
    width: 90% !important;
    height: auto;
    border-radius: 25px;
    overflow: hidden;
    bottom: unset;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media(max-width: 740px) {
  .hero-bg-text {
    margin-bottom: 40px;
  }
  .hero-bg {
    background-size: cover, 150% auto;
  }

}

@media(max-width: 540px) {
  .hero-bg-text > h1 {
    text-align: center !important;
  }
  .vid-wrap-mobile {
    top: 55%;
  }
  .hero-bg {
    background-size: cover, 200% auto;
  }
}
@media(max-width: 460px) {
  .vid-wrap-mobile {
    top: 70%;
  }
  .hero-bg {
    background-size: cover, 310% auto;
  }
}
</style>