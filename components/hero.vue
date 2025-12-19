<style>
/* When overlay is hidden/disabled */
.hero-bg-overlay.hide {
  background: none;
}

.hero-bg {
  position: relative;
  min-height: 105vh;

}

.hero-curve-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: var(--curve-h, 130vh);
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.hero-curve {
  position: absolute;
  left: 50%;
  height: 100%;
  bottom: 0;
  width: 100vw;
  transform: translateX(-50%) scaleX(1.05);
  object-fit: cover;
}

/* tune the curve height/zoom by breakpoint */

/* Global vars used by hero / overlay sizing */
:root {
  --overlay-h: 0px;
  --parkSpeed: .5s;
}

/* Fixed video wrapper used during pin (desktop and some mid widths) */
.vid-wrap-bg {
  position: fixed;
  width: 100%;
  height: calc(100% - 80px);
  left: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

/*.vid-wrap-bg {
  position: absolute;
  width: 60%;
  height: auto;
  border-radius: 25px;
  overflow: hidden;
  bottom: unset;
  left: 50%;
  translate: -50% 0;
}*/

/* Mobile video container (not fixed) */
.vid-wrap-reg {
  position: relative;
  width: 50%;
  height: auto;
  border-radius: 25px;
  overflow: hidden;
  left: 50%;
  translate: -50% 0;
}

/* Text block initial position + entry animation */
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

/* Text spacing tweak for mobile */
@media(max-width: 1400px) {
  .hero-bg-overlay {
    background-size: cover !important;
  }
  .vid-wrap-reg {
    width: 70%;
  }
}

/* Mid widths: make video wrapper behave like a centered “card” */
@media(max-width: 1150px) {
  .vid-wrap-bg {
    height: auto;
    border-radius: 25px;
    overflow: hidden;
    bottom: unset;
  }
}

/* Overlay banner layer (slides away via GSAP) */
.hero-bg-overlay {
  background:
      linear-gradient(transparent, transparent),
      url("/hero-curve-banner.png") no-repeat top center / cover;
  inset: 0;
  width: 100%;
  height: 115vh;
  z-index: 3;
  position: relative;
  will-change: transform;
  background-size: 100% 100%;
}

@keyframes animate-delay {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media(max-width: 900px) { .vid-wrap-reg { width: 85% }}

/* Smaller screens: reduce hero/overlay heights */
@media(max-width: 740px) {
  .hero-bg-text { margin-bottom: 40px; top: 80px; }
  .vid-wrap-reg { width: 80% }

}

/* Extra small: center headline and increase curve zoom */
@media(max-width: 540px) {
  .hero-bg-text > h1 { text-align: center !important; }
  .vid-wrap-reg { width: 90% }
}
@media(max-width: 460px) {
  .hero-bg-overlay { min-height: 140vh; }
  .hero-bg-text > h1 { margin-bottom: 10px; padding-top: 5px; }
  .hero-bg-text > p { margin-top: 10px }
}
</style>


<template>
  <div
      class="hero-bg w-screen text-white flex flex-col relative justify-start items-start pb-5 overflow-visible"
      ref="heroBgEl"
  >
    <div class="hero-curve-wrap">
      <img class="hero-curve" src="/hf-hero-bg-curve.svg" alt="" aria-hidden="true">
    </div>
    <!-- Video layer -->
    <div class="vid-wrap-bg" ref="vidWrapEl">
      <!-- Desktop cinematic component ONLY on first visit + wide screens -->
      <Hero-Vid ref="vidEl" v-if="fullAni" />

      <!-- Everything else (mobile + return visits + smaller widths) -->
      <div class="vid-wrap-reg" v-else ref="vidRegWrapEl">
        <video
            class="hero-vid"
            ref="vidRegEl"
            src="../public/HF_LOGO.mp4"
            type="video/mp4"
            muted
            preload="auto"
            playsinline
            style="object-fit: cover; width: 100%; height: 100%"
        />
      </div>
    </div>

    <!-- Overlay layer -->
    <div class="hero-bg-overlay" ref="heroOverlayEl">
      <div
          class="hero-bg-text ani w-11/12 md:w-9/10 lg:w-8/10 my-2 mx-auto lg:mx-24 z-50"
          ref="heroTextEl"
      >
        <h1 class="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black title text-md mb-4 pt-5">
          CELEBRATING 100 YEARS
        </h1>

        <p class="md:text-lg md:w-1/1 mt-9 xl:w-3/4 2xl:w-2/3 text-md">
          Over the past 100 years, we’ve transformed how local people and
          organizations mobilize to drive positive change. Founded in 1925 by two Hartford bankers, we began with a
          vision: to create a community-wide charitable endowment that would accept “gifts, devises, and bequests” and
          serve as a trustworthy, steadfast, and responsive resource—forever.
          Our timeline offers you a front-row seat to the moments that shaped the Foundation’s storied history and
          showcases how our donors, nonprofit partners, volunteers, and staff have come together for good.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick, computed, watch } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import HeroVid from '~/components/hero-vid.vue'
import { useFirstVisit } from '~/composables/useFirstVisit'

gsap.registerPlugin(ScrollTrigger)

/** viewport */
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 9999)
const yPercent = ref(60)

let heroTL: gsap.core.Timeline | null = null

/** first-visit state (localStorage-backed) */
const { ready, hasSeen, markSeen, resetSeen } = useFirstVisit()

/**
 * Cinematic intro should run ONLY when:
 * - client storage checked (ready)
 * - user has NOT seen it yet
 * - desktop/wide enough for your teleport version
 */
const fullAni = computed(() => {
  return ready.value && !hasSeen.value && width.value > 1150
})

/** refs */
const heroBgEl = ref<HTMLElement | null>(null)
const heroOverlayEl = ref<HTMLElement | null>(null)
const heroTextEl = ref<HTMLElement | null>(null)

const vidEl = ref<InstanceType<typeof HeroVid> | null>(null)
const vidWrapEl = ref<HTMLElement | null>(null)
const vidRegWrapEl = ref<HTMLElement | null>(null)
const vidRegEl = ref<HTMLVideoElement | null>(null)

let mm: gsap.MatchMedia | null = null

function onResize() {
  width.value = window.innerWidth
  heroTL?.invalidate();
  ScrollTrigger.refresh()
}

function getYPercent(down = false) {
  const w = width.value
  const base =
    w > 1400 ? 15 :
    w > 1150 ? 10 :
    w > 1000 ? 60 :
    w > 800  ? 50 :
    w > 600  ? 70 :
    w > 400  ? 95 :
    150

  return down ? base * 1.25 : base
}


onMounted(async () => {
  await nextTick()

  onResize()
  window.addEventListener('resize', onResize)

  // keep overlay height in CSS var

  // build GSAP after ready is known
  watch(
      () => ready.value,
      async (isReady) => {
        if (!isReady) return
        console.log('seen');
        console.log(hasSeen)
        await nextTick()
        buildHeroGsap()
      },
      { immediate: true }
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    mm?.kill()
    mm = null
  })
})

function buildHeroGsap() {
  const hero = heroBgEl.value
  const overlay = heroOverlayEl.value
  const text = heroTextEl.value
  if (!hero || !overlay || !text) return
  console.log(fullAni)
  console.log(hasSeen)
  // pick the actual <video> element depending on which branch is mounted
  const desktopVideo = vidEl.value?.vidEl ?? null
  const fallbackVideo = vidRegEl.value ?? null
  const video = desktopVideo || fallbackVideo

  mm?.kill()
  mm = gsap.matchMedia()

  let vidAniDone = false

  function lockScroll(tl: gsap.core.Timeline) {

    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      onEnded(tl)
    }, 250)
  }

  mm.add('(min-width: 100px)', () => {
    gsap.set([overlay, text], { clearProps: 'position,top' })

    heroTL = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end:
          width.value > 1350 ? '+=140%' :
          width.value > 1150 ? '+=120%' :
          width.value > 800  ? '+=130%' :
          width.value > 600  ? '+=100%' :
          '+=50%',
        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: () => {
          // On reg ani play video near end
          if (!fullAni.value && video) {
            const st = tl.scrollTrigger
            const p = st ? st.progress : 0
            if (!vidAniDone && p >= 0.9) {
              vidAniDone = true
              video.play?.()
            }
          }

          // Desktop cinematic end: when overlay is basically gone, finish intro
          if (fullAni.value) {
            const overlayProgress = overlayTween?.progress?.() ?? 0
            if (!vidAniDone && overlayProgress >= 0.9) {
              vidAniDone = true
              if(heroTL) lockScroll(heroTL)
            }
          }
        }
      }
    })
    const tl = heroTL;


    // overlay slides away
    const overlayTween = tl.to(overlay, { yPercent: -100, ease: 'none' }, 0)

    // reg video: move wrapper
    if (!fullAni.value && vidWrapEl.value) {
      gsap.set(vidWrapEl.value, { yPercent: () => getYPercent() })

      tl.to(
          vidWrapEl.value,
          {
            yPercent: () => getYPercent(true),
            ease: 'none'
          },
          0
      )

      tl.to(
          vidWrapEl.value,
          {
            yPercent: () => getYPercent(true),
            ease: 'none'
          },
          0.35
      )
    }

    return () => {
      tl.scrollTrigger?.kill(true)
      tl.kill()
      gsap.set([overlay, text], { clearProps: 'transform' })
    }
  })

  function onEnded(tl: gsap.core.Timeline | null) {
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
}
</script>
