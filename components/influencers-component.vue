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
  width: 100vw;
  height: auto;
  aspect-ratio: 1/1;
  --stroke-w: 225;
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
    --stroke-w: 175;
  }
}

@media(max-width: 1000px) {
  .gradient-circle {
    --stroke-w: 160;
  }
}

@media(max-width: 768px) {
  .gradient-circle {
    top: -250px;
    left: -100px;
    --stroke-w: 125
  }
}
@media(max-width: 550px) {
  .gradient-circle {
    top: -180px;
    --stroke-w: 100;
  }
}


.intro {
  background: #0a7aff;
  display: inline-block;
  letter-spacing: 0.65px;
  text-transform: uppercase;
  padding: 14px 26px;
}
.intro.animate {
  clip-path: inset(0);
}


</style>
<template ref="influenWrapEl" style="--neg-margin: 0px">
  <section class="relative mt-36 md:mt-12 pt-26 sm:pt-28 md:pt-44 xl:pt-80 px-2 md:px-12" ref="sectionEl" data-io="section">

    <svg
        data-io="circle"
        class="gradient-circle"
        ref="gradientCircleEl"
        width="1727"
        height="1727"
        viewBox="-120 -120 2027 2027"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <!-- rotate so the "start" point is bottom -->
      <!-- LEFT: bottom -> top along the left side -->
      <path
          ref="gradientArcLeftEl"
          d="M 863.5 1580.87 A 717.37 717.37 0 0 1 863.5 146.13"
          fill="none"
          stroke="url(#paint0_linear)"
          stroke-width="var(--stroke-w)"
          stroke-opacity="0.2"
          vector-effect="non-scaling-stroke"
          stroke-linecap="butt"
      />

      <!-- RIGHT: bottom -> top along the right side -->
      <path
          ref="gradientArcRightEl"
          d="M 863.5 1580.87 A 717.37 717.37 0 0 0 863.5 146.13"
          fill="none"
          stroke="url(#paint0_linear)"
          stroke-width="var(--stroke-w)"
          stroke-opacity="0.2"
          vector-effect="non-scaling-stroke"
          stroke-linecap="butt"
      />

      <defs>
        <linearGradient
            id="paint0_linear"
            x1="863.5"
            y1="0"
            x2="863.5"
            y2="1727"
            gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#007AFD" />
          <stop offset="0.639423" stop-color="white" />
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

    <div class="px-6 md:px-12">
      <span ref="introEl"
        class="text-1xl sm:text-1xl intro text-white px-4 py-1 sm:ms-6 sans-serif font-extrabold"
      >Introducing our<br></span>

      <h2 ref="headEl"
        class="text-5xl sm:text-6xl font-black mb-24 text-cetacean mt-2 sm:ms-6"
      >100 Influencers</h2>

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

const headEl = ref<HTMLElement | null>(null);
const introEl = ref<HTMLElement | null>(null);
const gradientCircleEl = ref<SVGElement | null>(null);
const gradientArcLeftEl = ref<SVGPathElement | null>(null);
const gradientArcRightEl = ref<SVGPathElement | null>(null);

function setupDraw(path: SVGPathElement) {
  const len = path.getTotalLength();
  path.style.transition = 'none';
  path.style.strokeDasharray = `${len + 275}`;
  path.style.strokeDashoffset = `${len}`;
}

function playDraw(path: SVGPathElement) {
  path.getBoundingClientRect();
  requestAnimationFrame(() => {
    path.style.transition = 'stroke-dashoffset 3s ease-in-out';
    path.style.transitionDelay = '.5s';
    path.style.strokeDashoffset = '0';
  })
}


onMounted(async () => {
  await nextTick()

  const setupObserve = () => {
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          introEl.value?.classList.add('animate')
          introObserver.unobserve(entry.target)
        }
      })
    }, {
      threshold: .8
    })

    const circleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const left = gradientArcLeftEl.value
          const right = gradientArcRightEl.value

          if (left && right && gradientCircleEl.value) {
            setupDraw(left)
            setupDraw(right)

            gradientCircleEl.value.style.opacity = '1'

            playDraw(left)
            playDraw(right)
          }
          circleObserver.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.15,
    })

    if (headEl.value) introObserver.observe(headEl.value)
    if (gradientCircleEl.value) circleObserver.observe(gradientCircleEl.value)
  }

  setTimeout(setupObserve, 2000)

})



</script>
