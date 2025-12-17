<style>
/* When overlay is hidden/disabled */
.hero-bg-overlay.hide {
  background: none;
}

/* Hero background curve + minimum scroll space */
.hero-bg {
  position: relative;
  min-height: 185vh;
  background:
      linear-gradient(transparent, transparent) no-repeat top / cover,
      url('/hf-hero-bg-curve.svg') no-repeat top / 105% auto;
}

/* Global vars used by hero / overlay sizing */
:root {
  --overlay-h: 0px;
  --parkSpeed: .5s;
}

/* Fixed video wrapper used during pin (desktop and some mid widths) */
/*.vid-wrap-bg {
  position: fixed;
  width: 100%;
  height: calc(100% - 80px);
  left: 0;
  bottom: 0;
  z-index: 97;
  pointer-events: none;
}*/

.vid-wrap-bg {
  position: absolute;
  width: 60%;
  height: auto;
  border-radius: 25px;
  overflow: hidden;
  bottom: unset;
  left: 50%;
  translate: -50% 0;
}

/* Mobile video container (not fixed) */
.vid-wrap-mobile {
  position: relative;
  width: 100% !important;
  height: auto;
  border-radius: 25px;
  overflow: hidden;
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
@media screen and (max-width: 768px) {
  .hero-bg-text { top: 80px; }
}

/* Overlay banner layer (slides away via GSAP) */
.hero-bg-overlay {
  background:
      linear-gradient(transparent, transparent),
      url("/hero-curve-banner.png") no-repeat top center / cover;
  inset: 0;
  height: 115vh;
  z-index: 98;
  position: relative;
  will-change: transform;
}

@keyframes animate-delay {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Responsive min-height and background scaling */
@media(max-width: 1700px) {
  .hero-bg { min-height: 140vh }
}
@media(max-width: 1500px) {
  .hero-bg { min-height: 100vh; }
}

/* Mid widths: make video wrapper behave like a centered “card” */
@media(max-width: 1150px) {
  .vid-wrap-bg {
    width: 90% !important;
    height: auto;
    border-radius: 25px;
    overflow: hidden;
    bottom: unset;
    left: 50%;
    translate: -50% 0;
  }
}

/* Background curve scaling by breakpoint */
@media(max-width: 950px) {
  .hero-bg { background-size: cover, 120% auto; }
}
@media(max-width: 800px) {
  .hero-bg { background-size: cover, 160% auto; }
}

/* Smaller screens: reduce hero/overlay heights */
@media(max-width: 740px) {
  .hero-bg-text { margin-bottom: 40px; }
  .hero-bg {
    min-height: 75vh;
    background-size: cover, 150% auto;
  }
  .hero-bg-overlay { height: 80vh; }
}

/* Extra small: center headline and increase curve zoom */
@media(max-width: 540px) {
  .hero-bg-text > h1 { text-align: center !important; }
  .hero-bg { background-size: cover, 200% auto; }
}
@media(max-width: 460px) {
  .hero-bg-overlay { min-height: 140vh; }
  .hero-bg-text > h1 { margin-bottom: 10px; padding-top: 5px; }
  .hero-bg-text > p { margin-top: 10px }
  .hero-bg { background-size: cover, 325% auto; }
}
</style>


<template>
  <!-- Hero wrapper: background + pinned video layer + overlay text -->
  <div
      class="hero-bg text-white flex flex-col relative justify-start items-start pb-5 overflow-visible"
      ref="heroBgEl"
  >

    <!-- Video layer (desktop component OR mobile <video>) -->
    <div class="vid-wrap-bg" ref="vidWrapEl">
      <!-- Desktop: custom component -->
      <Hero-Vid ref="vidEl" v-if="!isMobile"/>

      <!-- Mobile: native video (separate wrapper so you can animate it differently if needed) -->
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

    <!-- Overlay layer that slides away + contains the headline/body copy -->
    <div class="hero-bg-overlay" ref="heroOverlayEl">
      <div
          class="hero-bg-text ani w-11/12 md:w-9/10 lg:w-8/10 my-2 mx-auto mx-4 md:mx-24 z-50"
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

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import HeroVid from '~/components/hero-vid.vue'
import AboutTimeline from "~/components/about-timeline.vue";

/**
 * Reactive viewport width + derived mobile breakpoint
 * (Template uses isMobile to swap desktop HeroVid vs mobile <video>)
 */
const width = ref(window.innerWidth)
const yPercent = ref(60)
const isMobile = computed(() => width.value < 768)

/**
 * Resize handler:
 * - updates width
 * - updates the yPercent target used for video movement
 * - refreshes ScrollTrigger so pinned layout/end points stay correct
 */
function onResize() {
  width.value = window.innerWidth
  yPercent.value =
    width.value > 1400 ? 20 :
    width.value > 1000 ? 20 :
    width.value > 800  ? 40 :
    width.value > 600  ? 60 :
    width.value > 400  ? 85 :
    150;

  ScrollTrigger.refresh();
}

gsap.registerPlugin(ScrollTrigger)

/**
 * Refs for video / wrapper elements
 * - vidEl is the HeroVid component instance (desktop)
 * - vidWrapEl is the fixed wrapper that gets animated
 * - vidMobileWrapEl is the mobile wrapper (present only on mobile)
 */
const vidEl = ref<InstanceType<typeof HeroVid> | null>(null);
const vidMobileWrapEl = ref<HTMLElement | null>(null);
const vidWrapEl = ref<HTMLElement | null>(null);

/**
 * MatchMedia holder so GSAP can swap timelines on breakpoint changes
 */
let mm: gsap.MatchMedia | null = null

/**
 * Refs for the hero root + overlay/text (overlay slides away)
 */
const heroBgEl = ref<HTMLElement | null>(null);
const heroOverlayEl = ref<HTMLElement | null>(null);
const heroTextEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  // Initialize sizing targets once DOM exists
  onResize();
  await nextTick();
  console.log(heroBgEl.value)

  // Grab the actual <video> element from the HeroVid component (desktop)
  const video = vidEl.value?.vidEl ?? null

  /**
   * Keep a CSS variable in sync with overlay height.
   * Used for layout-dependent styling and also forces ScrollTrigger to refresh.
   * Needs an update to be used for consistent overlay/background sizing
   */
  const setOverlayH = () => {
    const h = heroOverlayEl.value?.getBoundingClientRect().height ?? 0;
    document.documentElement.style.setProperty('--overlay-h', `${h}px`);

    ScrollTrigger.refresh();
  };

  // ResizeObserver keeps --overlay-h updated if overlay content changes
  const ro = new ResizeObserver(setOverlayH);
  if (heroOverlayEl.value) ro.observe(heroOverlayEl.value);

  // Track resizes for breakpoint logic + ScrollTrigger refresh
  window.addEventListener('resize', onResize)

  /**
   * Used to prevent re-triggering the same “video finished / overlay left” actions.
   */
  let vidAniDone = false;

  /**
   * Temporarily lock scrolling once the overlay has fully left (desktop >1150 case),
   * then transition to the “ended” behavior.
   */
  function lockScroll(tl: gsap.core.Timeline) {
    vidAniDone = true
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      onEnded(tl);
    }, 250)
  }

  // Setup GSAP matchMedia to rebuild animation logic per breakpoint
  mm = gsap.matchMedia()

  // Keep references to the two main tweens so we can read progress in onUpdate()
  let overlayTween: gsap.core.Animation | null = null;
  let videoTween: gsap.core.Animation | null = null;

  // Track whether overlay fully exited (desktop)
  let overlayLeft = false;

  /**
   * Main hero ScrollTrigger/timeline.
   * Note: the query is min-width: 100px so it effectively always runs,
   * but it's still inside matchMedia so it gets cleaned up on resize changes.
   */
  mm.add('(min-width: 100px)', () => {
    const hero = heroBgEl.value
    const overlay = heroOverlayEl.value
    const text = heroTextEl.value
    if (!hero || !overlay || !text) return

    // Ensure sticky props aren't “left over” between breakpoint swaps
    gsap.set([overlay, text], { clearProps: 'position,top' })

    // Timeline is scroll-controlled (scrub) and pins the hero
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',

        // End distance is responsive (changes with width)
        end:
            width.value > 1150 ? '+=140%' :
            width.value > 800 ? '+=130%' :
            width.value > 600 ? '+=100%' :
            '+=50%',

        scrub: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,

        /**
         * onUpdate is used to detect “near end” conditions:
         * - Desktop (>1150): when overlay tween finishes, lock scroll + end logic
         * - Smaller: when video tween hits ~90%, play the actual video
         */
        onUpdate: () => {
     /*     if(window.innerWidth > 1150) {
            if(overlayTween) {
              const p = overlayTween.progress();
              if(!overlayLeft && p >= 0.999 && !vidAniDone) {
                overlayLeft = true;
                vidAniDone = true;
                lockScroll(tl)
              }
            }
          } else {*/
            if(videoTween) {
              const p = videoTween.progress();
              if(!vidAniDone && p >= .9) {
                vidAniDone = true;
                video?.play();
              }
            }
          //}
        }
      }
    })

    // Overlay slides up and off (reveals the video layer below)
    overlayTween = tl.to(overlay, { yPercent: -100, ease: 'none' }, 0);

    /**
     * For widths <= 1150: also animate the video wrapper.
     * (Desktop >1150 relies more on overlay leaving + lockScroll behavior.)
     */
    let temp = true
    if(window.innerWidth <= 1150 || temp) {
      // Set initial yPercent to match computed target
      gsap.set(vidWrapEl.value, { yPercent: yPercent.value })

      // Primary video movement tween
      videoTween = tl.to(
          vidWrapEl.value,
          {
            yPercent: width.value > 400 ? yPercent.value * 1.25 : yPercent.value,
            ease: "none"
          },
          0
      )

      // Secondary keyframe-ish “hold” / repeat at later time
      tl.to(
          vidWrapEl.value,
          {
            yPercent: width.value > 400 ? yPercent.value * 1.25 : yPercent.value,
            ease: "none"
          },
          .35
      )
    }

    /**
     * Cleanup when matchMedia invalidates:
     * - kill ScrollTrigger
     * - kill timeline
     * - clear transforms so DOM doesn’t keep stale animated state
     */
    return () => {
      tl.scrollTrigger?.kill(true)
      tl.kill()
      gsap.set([overlay, text], { clearProps: 'transform' })
    }
  })

  /**
   * End behavior once the “hero intro” is complete.
   * - Desktop (>1150): kill pin so page continues normally
   * - Mid widths: adjust end distance and refresh
   */
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

