<template>
  <div class="overflow-visible relative">
    <!-- Keep your nav fixed OUTSIDE smoother -->
    <Nav class="site-header" />

    <!-- ScrollSmoother structure -->
    <div class="smooth-wrapper">
      <div class="smooth-content">
        <div class="hf-page">
          <slot />
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

let smoother: ScrollSmoother | null = null
let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()

  if ((window as any).__smoother) {
    smoother = (window as any).__smoother
    smoother.refresh()
    return
  }

  const header = document.querySelector<HTMLElement>('.site-header')
  const content = document.querySelector<HTMLElement>('.smooth-content')

  const setPadTop = () => {
    if (!content) return
    const h = header?.offsetHeight ?? 0
    content.style.paddingTop = h + 'px'
  }
  setPadTop()
  if (header && 'ResizeObserver' in window) {
    ro = new ResizeObserver(setPadTop)
    ro.observe(header)
  }
  window.addEventListener('resize', setPadTop)

  smoother = ScrollSmoother.create({
    wrapper: '.smooth-wrapper',
    content: '.smooth-content',
    smooth: 0.25,
    effects: true,
    smoothTouch: 0.1,
  });
  (window as any).__smoother = smoother
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {})
  ro?.disconnect()
  ro = null
})
</script>

<style>
html, body { margin: 0; padding: 0; height: 100%; }

.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
}

.smooth-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
}
.smooth-content {
  min-height: 100%;
  will-change: transform;
}

.hf-page {
  min-height: 70vh;
  margin: 0 auto;
}
</style>
