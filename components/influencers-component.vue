<style scoped>
.bufferMargin {
  margin-top: var(--neg-margin);
}

.circle-fade {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  z-index: -1;
  height: auto;
}

.gradient-circle {
  position: absolute;
  top: -7%;
  left: -200px;
  z-index: -1;
  opacity: 0;
  animation: circle .25s ease 2s forwards;
  width: 100vw;
  height: auto;
  aspect-ratio: 1/1;
}

@media(max-width: 1400px) {
  .gradient-circle {
    top: -5%;
  }
}
@media(max-width: 1200px) {
  .gradient-circle {
    top: -4%;
    left: -100px;
  }
}

@media(max-width: 768px) {
  .gradient-circle {
    top: -250px;
    left: -100px;
  }
}

@keyframes circle {
  from {opacity:0}
  to {opacity: 1}
}

.intro {
  background: #0a7aff;
  will-change: clip-path;
  transition: clip-path .75s ease-in;
  clip-path: inset(0% 100% 0% 0%)
}
.intro.animate {
  clip-path: inset(0);
}


</style>
<template ref="influenWrapEl" style="--neg-margin: 0px">
  <section class="relative mt-36 md:mt-12 pt-26 sm:pt-28 md:pt-44 xl:pt-80 px-2 md:px-12">

    <svg class="gradient-circle" width="1727" height="1727" viewBox="0 0 1727 1727" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M863.5 1727C1340.4 1727 1727 1340.4 1727 863.5C1727 386.602 1340.4 0 863.5 0C386.602 0 0 386.602 0 863.5C0 1340.4 386.602 1727 863.5 1727ZM863.499 1434.74C548.013 1434.74 292.26 1178.99 292.26 863.5C292.26 548.014 548.013 292.262 863.499 292.262C1178.99 292.262 1434.74 548.014 1434.74 863.5C1434.74 1178.99 1178.99 1434.74 863.499 1434.74Z" fill="url(#paint0_linear_37_163)" fill-opacity="0.2"/>
      <defs>
        <linearGradient id="paint0_linear_37_163" x1="863.5" y1="0" x2="863.5" y2="1727" gradientUnits="userSpaceOnUse">
          <stop stop-color="#007AFD"/>
          <stop offset="0.639423" stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>


    <svg class="circle-fade" width="1728" height="1661" viewBox="0 0 1728 1661" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M862.001 0C1245.17 5.4246e-05 1609.93 85.1242 1941 238.83V1660.24H-217V238.831C114.069 85.1247 478.836 0 862.001 0Z" fill="url(#paint0_linear_37_146)" fill-opacity="0.5"/>
      <defs>
        <linearGradient id="paint0_linear_37_146" x1="1014" y1="-12" x2="1008" y2="881" gradientUnits="userSpaceOnUse">
          <stop stop-color="#007AFD"/>
          <stop offset="0.689547" stop-color="#FFFCF6"/>
        </linearGradient>
      </defs>
    </svg>

    <div class="px-6 md:px-12" ref="introEl">
      <span
        class="text-3xl sm:text-4xl intro text-white px-4 py-1 sm:ms-6"
      >INTRODUCING OUR<br></span>

      <h2
        class="text-5xl sm:text-6xl font-black mb-24 text-cetacean mt-2 sm:ms-6"
      >100 INFLUENCERS</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <InfluencerCard
            v-for="influencer in sortedInfluencers"
            :key="influencer.id"
            :influencer="influencer"
            @click="openModal(influencer)"
        />
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { useInfluencers } from '~/composables/useInfluencers'
import { useStore } from '~/stores/store'
import InfluencerCard from '~/components/influencer-card.vue'

const { data } = useInfluencers()
const store = useStore()

const introEl = ref<Element | null>(null);

const influencers = computed(() => data.value ?? [])

const sortedInfluencers = computed(() => {
  return [...influencers.value].sort((a, b) =>
      a.influencerDetails.name.localeCompare(b.influencerDetails.name)
  )
})

const influenWrapEl = ref<HTMLElement | null>(null);

const width = ref(window.innerWidth);
const rowHeight = 100;
const bufferRows = 5;
function checkTlBuffer() {
  width.value = window.innerWidth;
  if(width.value > 1380 && influenWrapEl.value) influenWrapEl.value.style.setProperty('--neg-margin', `${bufferRows * rowHeight}px`);
}

const openModal = (influencer: any) => {
  store.openModal(influencer)
}
onMounted(async () => {
  await nextTick()

  if(introEl.value) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          introEl.value?.firstElementChild?.classList.add('animate');
          io.unobserve(entry.target);
        }
      })
    })
    io.observe(introEl.value);
  }
})

</script>
