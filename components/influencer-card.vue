<style scoped>
/* === Base grid card === */
.influencer-card {
  width: 100%;
  height: 100%;
  grid-column: span 1;
  grid-row: span 1;
  position: relative;
  overflow: visible;
}

/* Expanded state (takes more grid space) */
.influencer-card--active {
  grid-column: span 2;
  grid-row: span 2;
  z-index: 1;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
}

/* Inner animated container (smooth grow/shrink) */
.card-inner {
  will-change: width, height;
  transition:
      width 420ms cubic-bezier(0.16, 1, 0.3, 1),
      height 420ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top center;
  position: absolute;
  left: 0;
  top: 0;
}

/* Hide compact UI layers when expanded */
.influencer-card--active .card-wrap::after,
.influencer-card--active .details-bg,
.influencer-card--active .details-wrap {
  opacity: 0 !important;
}

/* Decorative bottom graphic (slides up on hover) */
.card-wrap::after {
  position: absolute;
  content: '';
  width: 105%;
  background: url("../public/town-bg.png") no-repeat;
  height: auto;
  background-size: cover;
  aspect-ratio: 2.4/1;
  bottom: 0;
  left: 3px;
  z-index: 3;
  transition: transform .75s ease, opacity .5s;
  transform: translateY(100px);
  opacity: 0;
  will-change: transform;
}

.card-wrap.hover::after {
  transform: translateY(15px) !important;
  opacity: 1;
}

/* Allow expanded card to overflow grid cleanly */
.influencer-card--active .card-wrap {
  display: flow-root;
  overflow: visible;
}

.card-wrap {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Influencer image positioning */
.headshot {
  object-fit: cover;
  object-position: center top;
  justify-self: flex-end;
  float: right;
  margin-left: .75rem;
  margin-bottom: .25rem;
}

/* Background ellipse behind details */
.details-bg {
  position: absolute;
  width: 125%;
  aspect-ratio: 1.125 / 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1125 1000'><ellipse cx='562.5' cy='500' rx='562.5' ry='500' fill='white'/></svg>");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center top;
  left: -3%;
  bottom: 35%;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  z-index: 1;
  transition: transform .75s ease, opacity .35s;
  will-change: transform;
}

.details-bg.hover {
  transform: translateY(85%) !important;
}

/* Name / title styling */
.details-name {
  color: var(--color-cetacean);
  max-width: 90%;
  font-size: 26px;
}

.details-title,
.details-town {
  color: #0C6DD4;
  transition: transform .75s ease, opacity .5s ease;
  max-width: 75%;
  will-change: transform;
}

/* Shared “shown” animation state */
.details-title.shown,
.details-town.shown {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

/* Default hidden positions */
.details-town {
  opacity: 0;
  transform: translateY(-100px);
}
.details-title {
  opacity: 0;
  transform: translateY(100px);
}

/* Right-aligned detail stack */
.details-wrap {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: end;
  right: 0;
  bottom: -15px;
  z-index: 2;
  width: 100%;
  padding-right: 5%;
  transform: translateY(-15px);
  transition: transform .75s ease, opacity .35s;
  text-align: end;
  will-change: transform;
}

.details-wrap.hover {
  transform: translateY(-125px);
}

/* Expanded-only description */
.description-text {
  display: none;
  opacity: 0;
  animation: fade-text .25s .3s forwards;
}

.influencer-card--active .description-text {
  display: block;
  padding: 1rem;
  opacity: 0;
}

/* Expanded-only name */
.details-name-active {
  font-size: 28px;
  display: none;
  opacity: 0;
  color: var(--color-cetacean);
  animation: fade-text .25s .3s forwards;
}

@keyframes fade-text {
  from { opacity: 0 }
  to { opacity: 1 }
}

.influencer-card--active .details-name-active {
  display: block;
}
</style>


<template>
  <!-- Outer card wrapper
       - grid item
       - toggles expanded state via isActive
       - click emits to parent (selection logic lives above this component) -->
  <div
      class="flex flex-col overflow-hidden rounded-2xl column influencer-card"
      :class="{ 'influencer-card--active': isActive }"
      @click="emit('click');"
      ref="gridWrapEl"
  >

    <!-- Animated inner container
         This is what actually resizes smoothly when the card grows/shrinks -->
    <div class="card-inner" ref="cardInnerEl">

      <!-- Card content wrapper (image + text layers) -->
      <div class="card-wrap rounded-2xl" ref="cardWrapEl">

        <!-- Top-right metadata (town / name / title) -->
        <div class="details-wrap">
          <span class="details-town text-md font-bold shown">
            {{ influencer.influencerDetails.town || 'Hartford' }}
          </span>

          <h3 class="details-name text-3xl font-bold">
            {{
              influencer.influencerDetails.honorific
                  ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
                  : `${influencer.influencerDetails.name}`
            }}
          </h3>

          <span class="details-title text-md font-bold text-nowrap">
            {{ influencer.influencerDetails.title || 'Influencer' }}
          </span>
        </div>

        <!-- Decorative background ellipse behind details -->
        <div class="details-bg" />

        <!-- Influencer image
             Size is manually synced to grid cell size for animation -->
        <img
            :src="influencer.influencerDetails.image?.node?.sourceUrl || '/placeholder.png'"
            class="bg-cover rounded-2xl headshot"
            :alt="influencer.influencerDetails.name"
            ref="cardImgEl"
        />

        <!-- Expanded-state name -->
        <h2 class="details-name-active font-bold text-center mt-7">
          {{ influencer.influencerDetails.honorific
            ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
            : `${influencer.influencerDetails.name}`
          }}
        </h2>

        <!-- Expanded-state description -->
        <p class="description-text text-lg">
          {{ influencer.influencerDetails.description }}
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'

/**
 * Props:
 * - influencer: full influencer data object
 * - isActive: whether this card is expanded in the grid
 */
const props = defineProps<{
  influencer: {
    id: string;
    title: string;
    slug: string;
    link: string;
    influencerDetails: {
      honorific: string;
      name: string;
      title: string;
      town: string;
      description: string;
      image?: {
        node?: {
          sourceUrl: string;
        };
      };
    };
  };
  isActive: boolean;
}>()

/**
 * Click event emitted upward so parent controls active state
 */
const emit = defineEmits<{
  (e: 'click'): void
}>()

/**
 * DOM refs used for size syncing + hover behavior
 */
const cardWrapEl = ref<HTMLElement | null>(null);
const cardInnerEl = ref<HTMLElement | null>(null);
const gridWrapEl = ref<HTMLElement | null>(null);
const cardImgEl = ref<HTMLElement | null>(null);

/**
 * Prevent hover listeners from being attached more than once
 */
let hoverSet = false;

/**
 * Setup hover animations for desktop
 * - toggles classes that drive CSS transitions
 * - also triggers initial size sync
 */
async function setup() {
  if (hoverSet) return
  hoverSet = true
  await nextTick()

  if (cardWrapEl.value) {
    const title = cardWrapEl.value.querySelector('.details-title')
    const town = cardWrapEl.value.querySelector('.details-town')
    const detailsBG = cardWrapEl.value.querySelector('.details-bg')
    const detailsWrap = cardWrapEl.value.querySelector('.details-wrap')

    // Hover in: reveal title, hide town, animate background + wrap
    cardWrapEl.value.addEventListener('pointerenter', () => {
      cardWrapEl.value?.classList.add('hover')
      title?.classList.add('shown')
      town?.classList.remove('shown')
      detailsBG?.classList.add('hover')
      detailsWrap?.classList.add('hover')
    })

    // Hover out: revert to default compact state
    cardWrapEl.value.addEventListener('pointerleave', () => {
      cardWrapEl.value?.classList.remove('hover')
      title?.classList.remove('shown')
      town?.classList.add('shown')
      detailsBG?.classList.remove('hover')
      detailsWrap?.classList.remove('hover')
    })
  }

  await aniSize();
}

/**
 * Track whether image sizing has been initialized once
 */
let imgSet = false;

/**
 * Initial sizing pass
 * - syncs inner wrapper + image to grid cell dimensions
 * - ensures smooth expand animation later
 */
async function aniSize() {
  if(gridWrapEl.value && cardInnerEl.value) {
    await nextTick();

    const gridWrapH = gridWrapEl.value.offsetHeight;
    const gridWrapW = gridWrapEl.value.offsetWidth;

    cardInnerEl.value.style.height = `${gridWrapH}px`;
    cardInnerEl.value.style.width = `${gridWrapW}px`;

    // Image only needs to be set once initially
    if(!imgSet && cardImgEl.value) {
      cardImgEl.value.style.height = `${gridWrapH}px`;
      cardImgEl.value.style.width = `${gridWrapW}px`;
      imgSet = true;
    }
  }
}

/**
 * Resize handler
 * - keeps inner wrapper and image aligned to grid cell
 * - avoids resizing image while active (expanded state)
 */
function resizeAdjust() {
  if(!cardImgEl.value || !cardInnerEl.value || !cardWrapEl.value || !gridWrapEl.value) {
    return;
  }

  const rect = gridWrapEl.value.getBoundingClientRect();
  const gridWrapH = Math.floor(rect.height);
  const gridWrapW = Math.floor(rect.width);

  // Only resize image when not expanded
  if(!props.isActive) {
    cardImgEl.value.style.height = `${gridWrapH}px`;
    cardImgEl.value.style.width = `${gridWrapW}px`;
  }

  // Inner wrapper always matches grid cell
  cardInnerEl.value.style.height = `${gridWrapH}px`;
  cardInnerEl.value.style.width = `${gridWrapW}px`;
}

/**
 * Mount lifecycle:
 * - setup hover behavior
 * - initialize sizes
 * - attach resize listener
 */
onMounted(async () => {
  await setup();
  await aniSize();
  window.addEventListener('resize', resizeAdjust)
})

/**
 * Watch active state:
 * When card expands or collapses, re-measure sizes so
 * animation stays smooth and content fits correctly
 */
watch(
    () => props.isActive,
    async () => {
      await aniSize();
    }
)
</script>

