<template>
  <div class="overflow-visible relative">
    <svg width="1" height="1" preserveAspectRatio="none" fill="none" stroke-width="2" style="position: fixed; z-index: 999; pointer-events: none">
      <path id="logoPath" stroke="black" d="M1.09,3.11c4.23,22.52,85.06,421.8,384.91,505.79,131.99,36.97,348.19,24.55,396.26-96,40.45-101.44-39.33-276.53-167.49-294.13-126.63-17.38-246.23,126.42-241.02,232.85,8.45,172.59,357.13,330.93,490.21,226.72,126.82-99.3,72.03-428.54-59.53-484.62-137.86-58.76-289.14,212.72-510.64,175.66C154.42,246.07,59.59,112.71,1.09,3.11Z"/>

    </svg>
    <Nav class="site-header py-2" />


    <div class="hf-page">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, ref, provide, type Ref } from 'vue'


const navTeleportEl = ref<HTMLElement | null>(null)
provide<Ref<HTMLElement | null>>( 'navTeleportEl', navTeleportEl)

let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()

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
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {})
  ro?.disconnect()
  ro = null
})

</script>

<style>
html, body { margin: 0; padding: 0; height: 100%; }

html {
  scrollbar-gutter: stable;
  scroll-behavior: auto;
}

.vid {
  height: 100%;
  width: 100%;

}

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
