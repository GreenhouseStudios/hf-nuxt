<style scoped>
.timeline-title {
  position: relative;
  width: fit-content;
  margin: auto;
}

.timeline-title:after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -20px;
  width: 75%;
  height: 4px;
  background-color: #0a7aff;
  transform-origin: center;
  transition: transform .5s ease-in;
  transition-delay: .25s;
  transform: translateX(-50%) scaleX(0);
}

.timeline-title.animated:after {
  transform: translateX(-50%) scaleX(1);
}

/* === Core bento grid layout (CSS grid “masonry-ish”) === */
.bento-grid {
  display: grid;
  grid-auto-flow: row dense; /* lets items backfill gaps */
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-auto-rows: var(--row-h, 95px);
  gap: var(--gap, 25px);
  overflow-y: clip;
  --grid-shift-y: 0px;
  transform: translateY(var(--grid-shift-y));
  --buffer-rows: 5;
  --pitch: calc(var(--row-h, 95px) + var(--gap, 25px));
}



/* Used while recomputing layout to avoid flicker */
.bento-grid.computing {
  opacity: 0;
}

.bento-grid.no-grid-shift {
  --grid-shift-y: 0px !important;
}

.bento-grid * {
  overflow-anchor: none;
}


.grid-wrap {
  overflow: hidden;
}

.bento-grid.no-grid-shift {
  padding-bottom: 5rem !important;
}



/* Make inner wrappers always fill the <li> height */
.bento-inner {
  height: 100%;
}
.bento-inner > div {
  height: 100%;
}

/* Base “hidden” card state + transition for scroll-in animations */
.bento-card {
  opacity: .01;
  transition: transform .75s, opacity .75s;
  z-index: 7;
}

/* Most cards are interactive; special ones override */
.bento-card:not(.covid-card) {
  cursor: pointer;
}

.bento-inner:not(.covid-inner) {
  transition: transform 1s;
}

/* Initial offset used before IntersectionObserver reveals card */
.transform {
  transform: translateY(150px);
}

/* When COVID expands, other cards get a temporary translate via CSS var */
.adjustForCovid {
  --to-move: unset;
  transition: transform .75s ease !important;
  transform: var(--to-move) !important;
}

/* Separate initial offset for COVID wrapper */
.covid-transform {
  transform: translateY(150px);
}

/* === COVID wrapper card styling === */
.covid-card {
  opacity: .01;
  border-radius: calc(var(--ui-radius) * 4);
  transition: transform 1s, opacity .75s;
  transition-delay: .25s;
  position: relative;
  z-index: 8;
}

.covid-card.covid-open {
  grid-column: 1 / -1 !important;
}

/* Inner “banner” that expands (width on desktop / height on small cols) */
.covid-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  transition-delay: .25s;
  transition: width .75s ease-out, transform .75s ease-out;
  background: url("../public/covid-event-bg.png") no-repeat center bottom / cover;
  border-radius: calc(var(--ui-radius) * 4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 25px;
  gap: 15px;
}

/* Individual COVID posts that animate in/out */
.covid-post {
  display: flex;
  width: 15%;
  min-height: 100% !important;
  max-height: 100% !important;
  --delay: 0; /* stagger delay used by keyframes */
  cursor: pointer;
}

/* Ensure image fills the COVID post card */
.covid-post img {
  width: 100% !important;
}

/* Default “hidden” animation state (posts animate OUT) */
.covid-post.inactive {
  animation: covid-post-inactive-ani .5s var(--delay) ease forwards;
  opacity: 1;
  transform: translateY(0px);
}

/* Keyframes for hiding COVID posts */
@keyframes covid-post-inactive-ani {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(200px);
  }
}

/* Active state (posts animate IN) */
.covid-post.active {
  animation: covid-post-active-ani .5s var(--delay) ease forwards;
  opacity: 0;
  transform: translateY(200px);
}

/* Keyframes for showing COVID posts */
@keyframes covid-post-active-ani {
  from {
    opacity: 0;
    transform: translateY(200px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Small screen layout: COVID inner becomes a 2x2-ish grid */
@media(max-width: 1380px) {
  .covid-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    transform: translateY(-50%) !important;
    top: 50% !important;
  }
  .covid-post {
    width: auto;
    height: 100% !important;
  }
}

/* COVID title overlay shown when collapsed (hidden during expansion) */
#covid-title {
  position: absolute;
  text-align: center;
  color: white;
  margin-bottom: 0;
  max-width: 80%;
  height: fit-content !important;
  top: 50%;
  left: 50%;
  transition: opacity .25s;
  transform: translateX(-50%) translateY(-50%);
}
</style>

<style>
.grid-buffer-col {
  grid-column: var(--buf-col) / span 1;
  grid-row: 1 / span var(--buf-span);
  pointer-events: none;
  visibility: hidden;
  height: 0;
}
</style>

<template>
  <section>
    <!-- Page wrapper -->
    <div class="mb-36 overflow-hidden px-2 md:px-12">

      <!-- Title -->
      <h2 class=
        "text-cetacean
        text-4xl sm:text-5xl font-normal timeline-title dark:text-blue-300
        text-center"
        ref="titleEl"
      >CENTENNIAL<br><span class=
         "text-6xl sm:text-7xl font-black"

      >TIMELINE</span></h2>

      <!-- Filters UI -->
      <div id="timeline-filters">
        <Filters />
      </div>

      <!-- Card Layout (CSS Grid) -->
      <div class="flex flex-col justify-around">

        <!-- Empty state -->
        <div v-if="timelineItems.length === 0">
          No posts found.
        </div>

        <!-- Grid wrapper (opacity toggled during rebuilds) -->
        <div class="grid-wrap px-2 py-12 md:px-12" ref="gridWrapEl" v-else>
          <ul
              :key="`grid-${rebuildToken}-${numCols}`"
              ref="gridEl"
              id="card-grid"
              class="bento-grid py-10"
              :class="{ 'no-grid-shift': timelineFiltered }"
              :style="{
              '--cols': numCols,
              '--row-h': rowHeight + 'px',
              '--gap': gap + 'px',
            }"
          >


            <!-- Each item is either a normal post or the COVID wrapper -->
            <li
                v-for="item in timelineItems"
                :key="item.type === 'post' ? item.post.slug : 'covid-2020'"
                :class="[
                'bento-card',
                { 'quote-card': item.type === 'post' && item.post?.eventOptions?.postType === 'quote' },
                { 'covid-card': item.type === 'covid' }
              ]"
                :data-card-size="item.type === 'post'
                ? item.post?.eventOptions?.cardSize === 'small'
                  ? 'small'
                  : item.post?.eventOptions?.cardSize === 'large'
                    ? 'large'
                    : 'default'
                  : 'default'"
                :data-is-quote="item.type === 'post' && item.post?.eventOptions?.postType === 'quote' ? '1' : '0'"
                :data-is-covid="item.type === 'covid' ? '1' : '0'"
            >
              <!-- Normal posts: render one Card -->
              <div
                  v-if="item.type === 'post'"
                  class="bento-inner"
              >
                <Card
                    :post="item.post"
                    :x-multiplier="1"
                    :y-multiplier="1"
                    :quote-can-start="canPlayQuotes"
                    mode="fixedHeight"

                />
              </div>

              <!-- COVID wrapper: holds multiple posts, starts hidden -->
              <div
                  v-else
                  class="bento-inner covid-inner"
              >
                <Card
                    v-for="post in item.posts"
                    :key="post.slug"
                    :post="post"
                    :class="'covid-post inactive'"
                    style="display: none"
                    :x-multiplier="1"
                    :y-multiplier="1"
                    mode="fixedHeight"
                />
                <h2 id="covid-title" class="text-5xl md:text-6xl font-bold">COVID-19</h2>

                <!-- can be a single special card or a small list of covid cards -->
              </div>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </section>

</template>

<script lang="ts" setup>
import anime from 'animejs';
import {computed, nextTick, onMounted, provide, ref, watch} from 'vue';
import 'gridstack/dist/gridstack.min.css';
import {useStore} from '~/stores/store';
import Card from "~/components/card.vue";
import Filters from "~/components/filters.vue";
import { generateDocx } from '@/composables/useDocGenerate';
import {fetchPosts, usePosts} from "~/composables/usePosts";
import {useNuxtApp} from "#imports";

/**
 * Get post data + filter store
 */
const store = useStore();
const { data: posts } = usePosts();
const { $gsap } = useNuxtApp();
/**
 * Grid sizing + layout state
 * - numCols drives spans and special behavior
 * - layoutInProgress prevents overlapping layout passes
 * - covidCardGrow ensures covid init runs once per rebuild
 */

const canPlayQuotes = ref(false);
const currentlyPlayingMedia = ref<HTMLVideoElement | null>(null);


const numCols = ref(5);
let cols = numCols.value;
let rowHeight = 95;
const gap = 25;
let layoutInProgress = false;
let covidCardGrow = false;

/**
 * Handle media playback - ensure only one plays at a time
 */
function handleMediaPlay(videoElement: HTMLVideoElement) {
  // Pause the currently playing media if it's different from the new one
  if (currentlyPlayingMedia.value && currentlyPlayingMedia.value !== videoElement) {
    currentlyPlayingMedia.value.pause();
  }
  // Track the new playing media
  currentlyPlayingMedia.value = videoElement;
}

// Provide the function to child components
provide('handleMediaPlay', handleMediaPlay);

/**
 * Column/row span ranges used when assigning card sizes
 * (small/default/large influence later row/col span assignment)
 */
const smallCardRange = {
  col: 1,
  row: [3, 6]
}
const randCardRange = {
  col: [1, 2],
  row: [3, 7]
}
const lgCardRange = {
  col: 2,
  row: [3, 7]
}



/* DOM refs for grid wrapper + grid element */
const gridWrapEl = ref<HTMLElement | null>(null);
const gridEl = ref<HTMLElement | null>(null);

const titleEl = ref<HTMLElement | null>(null);

/* Timeline list is posts plus a special “covid group” item */
type TimelineItem =
    | { type: 'post'; post: Post }
    | { type: 'covid'; year: number; posts: Post[] }

const timelineFiltered = computed(() => { return store.timelineFilterCategory !== null })

/**
 * Hard rebuild on numCol change / post watch
 * - forces a clean layout pass
 * - resets covid state
 * - re-measures + re-packs the grid
 */
const rebuildToken = ref(0);
async function hardRebuild() {
  layoutInProgress = false;
  covidCardGrow = false;
  covid.state = 'idle';
  if(gridWrapEl.value && gridEl.value) {

    gridWrapEl.value.style.opacity = '0';
    if(numCols.value > 3) {
    }
  }

  rebuildToken.value++;
  await nextTick();
  await measureAndPack()

  if(gridWrapEl.value) gridWrapEl.value.style.opacity = '1'
}

/* === Image aspect ratio cache ===
   We cache AR by URL so repeated passes don’t re-load images. */
const imageARCache = new Map<string, number>();

async function getImageAR(url: string): Promise<number> {
  if (imageARCache.has(url)) return imageARCache.get(url)!;

  return new Promise(resolve => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const ar = img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : 1.5;
      imageARCache.set(url, ar);
      resolve(ar);
    };
    img.onerror = () => {
      imageARCache.set(url, 1.5);
      resolve(1.5);
    };
    img.src = url;
  });
}

/**
 * Build bento grid / measure & update bento cards
 * This is the main layout routine that:
 * - caches image AR
 * - assigns spans
 * - fills gaps
 * - handles COVID card setup
 * - runs animations when stable
 */
let imgChecked = false;
let packCount = 0;
async function measureAndPack(reset = false) {

  // prevent overlapping layout passes
  if(layoutInProgress) return;
  layoutInProgress = true;

  packCount++;

  if(packCount > 2) {
    layoutInProgress = false;
    packCount = 0;
    return await hardRebuild();
  }

  try {
    await nextTick();
    if(!gridEl.value) return;

    // pull all <li> cards (includes covid + quotes)
    const liElements = Array.from(gridEl.value.querySelectorAll('li'));

    // pre-cache image aspect ratios for normal cards (skip covid + quote)
    await Promise.all(
        liElements.map(async el => {
          if (el.dataset.isCovid === '1' || el.dataset.isQuote === '1') return;

          const img = el.querySelector('img');
          if (!img) return;

          const src = img.getAttribute('src');
          if (!src) return;

          const ar = await getImageAR(src);
          el.dataset.imgAr = String(ar);
        })
    );

    // Initialize covid card behavior once per rebuild, but only when allowed
    if(!covidCardGrow && shouldMakeCovid) {
      const covidLi = liElements.find(el => el.dataset.isCovid === '1') ?? null;
      if(covidLi) {
        covidCardGrow = true;

        // setup hover/tap open handler
        attachCovidOpen(covidLi as HTMLElement, gridEl.value as HTMLElement)

        // set base span for the wrapper based on columns
        setCovidSpan(covidLi, gridEl.value as HTMLElement);
      }
    }


    // 1-column layout: keep it simple and uniform-ish
    if(numCols.value === 1) {
      gridEl.value.classList.add('buffer-gone')
      liElements.forEach(el => {
        const rand = Math.random();


        const ar = parseFloat(el.dataset.imgAr || '1.5');

        el.style.gridColumn = 'span 1';
        el.dataset.colspan = '1';

        if(ar < .85) {
          el.style.gridRowEnd = 'span 5';
          el.dataset.rowspan = '5';
        } else {
          const rowspan = rand < .75 ? 4 : 3;
          el.style.gridRowEnd = `span ${rowspan}`;
          el.dataset.rowspan = `${rowspan}`
        }
      })
      nudgeImageMaxHeights(gridEl.value as HTMLElement);
      cardAnimation();
      return;
    }

    // Very small sets: force consistent sizing so layout doesn’t look broken
    if(liElements.length < 10 && !timelineFiltered.value) {
      gridEl.value.classList.add('buffer-gone')
      const rem = liElements.length % numCols.value;
      liElements.forEach(el => {
        el.style.gridRowEnd = 'span 5';
        el.dataset.rowspan = '5';
        el.style.gridColumn = 'span 1';
        el.dataset.colspan = '1';
      })
      cardAnimation();
      return;
    }

    // Optional full reset: wipe spans back to defaults before recalculating
    if(reset) {
      gridEl.value.classList.remove('buffer-gone');
      liElements.forEach(el => {
        if(el.dataset.isCovid === '1') { setCovidSpan(el as HTMLElement, gridEl.value as HTMLElement) }
        else if(el.dataset.isQuote === '1') { setQuoteSpan(el as HTMLElement, gridEl.value as HTMLElement) }
        else {
          el.style.gridColumn = 'span 1';
          el.dataset.colspan = '1';
          el.style.gridRowEnd = 'span 1';
          el.dataset.rowspan = '1';
        }
      });
    }
    await nextTick();

    // Assign column spans based on cardSize (large/small/default)
    liElements.forEach(el => {
      if(el.dataset.isCovid === '1' || el.dataset.isQuote === '1') return;
      let c;
      const ar = parseFloat(el.dataset.imgAr || '1.5');
      if(ar < 0.85) {
        c = 1;
      } else if(el.dataset.cardSize === 'large') {
        c = lgCardRange.col;
      } else if(el.dataset.cardSize === 'small') {
        c = smallCardRange.col;
      } else {
        c = Math.random() > .15 ? randCardRange.col[0] : randCardRange.col[1];
      }
      el.style.gridColumn = `span ${c}`;
      el.dataset.colspan = `${c}`;
    })

    imgChecked = true;

    // Quotes have fixed rules (override normal sizing)
    liElements.forEach(el => {
      if (el.dataset.isQuote === '1') {
        setQuoteSpan(el as HTMLElement, gridEl.value as HTMLElement);
      }
    });

    // Assign rowspans (aspect-aware + size intent)
    let totalCells = 0;

    liElements.forEach(el => {
      if (el.dataset.isCovid === '1' || el.dataset.isQuote === '1') return;

      const inner = el.querySelector('.bento-inner');
      if (!inner) return;

      const c = parseInt(el.dataset.colspan || '1', 10);

      let isPlaceholder = false;

      const img = el.querySelector('img');
      let src: string;
      if(img) {
        src = img.getAttribute('src') ?? '';
        if (img.dataset.placeholder === '1' || isPlaceholderImage(src)) isPlaceholder = true;
      }


      // Aspect ratio pulled from cached dataset value
      const ar = parseFloat(el.dataset.imgAr || '1.5');

      let r: number;

      // Pick base row span from aspect ratio buckets
      if(!isPlaceholder) {
        if (ar < 0.85) {
          // portrait
          r = Math.floor(Math.random() * 2) + 5; // 5–6
        } else if (ar < 1.2) {
          // near-square
          r = numCols.value > 4
              ? Math.floor(Math.random() * 2) + 4
              : Math.floor(Math.random() * 2) + 3;
        } else if (ar < 1.9) {
          // landscape
          if(c === 2) {
            r = Math.floor(Math.random() * 2) + 4; // 4–5
          } else {
            r = Math.floor(Math.random() * 2) + 3; // 3-4
          }
        } else {
          // ultra-wide
          r = 3;
        }
      } else {
        r = Math.floor(Math.random() * 2) + 2;
      }


      // Size intent tweaks
      if (el.dataset.cardSize === 'large' && numCols.value > 2) r += 1;
      if (el.dataset.cardSize === 'small') r -= 1;

      // Clamp keeps the rest of the gap logic sane
      r = Math.max(3, Math.min(6, r));

      el.style.gridRowEnd = `span ${r}`;
      el.dataset.rowspan = `${r}`;

      totalCells += r * c;
    });

    // Try to fill gaps by growing certain cards down
    await growAcrossTwoEmptyRows(8);
    await growSinglesByOne(8);
    await nextTick();

    // Recount after growth pass
    totalCells = 0;
    for (const el of liElements) {
      const r = parseInt(el.dataset.rowspan || '1', 10);
      const c = parseInt(el.dataset.colspan || '1', 10);
      totalCells += r * c;
    }

    // Lock inner heights so Card components match the computed <li> height
    Array.from(document.querySelectorAll<HTMLElement>('.bento-inner')).forEach(inner => {
      const div = <HTMLElement>inner.firstElementChild;
      if(div) {
        div.style.height = `${inner.offsetHeight}px`;
        div.style.minHeight=  `${inner.offsetHeight}px`;
      }
    })

    // Measure placements with transforms temporarily cleared (accuracy)
    await nextTick();
    const placements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement))
    for(let c = 1; c <= 5; c++) {
      let rowCount = 0;
      let prevRow = 0;
      placements.forEach(p => {
        if(prevRow === 0) prevRow = p.row + p.rowspan;
        if(p.col === c || (p.colspan > 1 && (p.col === c + 1 || p.col === c - 1))) {
          rowCount += p.rowspan;
          prevRow = p.row + p.rowspan;
        }
      });
    }

    // Helper to wait one paint frame before retry logic
    const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

    // If gaps still exist, try a second pass; if still broken, force a reset pass
    try {
      let newPlacements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement));
      const buffRows = getBufferRows(gridEl.value);
      let emptyGaps = gapsPerCol(newPlacements, numCols.value, buffRows);
      if(emptyGaps) {
        await nextFrame();

        await growSinglesByOne(8);
        await growAcrossTwoEmptyRows(8);
        await nextTick();

        newPlacements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement));
        await nextTick();
        const newEmpty = gapsPerCol(newPlacements, numCols.value, buffRows);
        if(newEmpty) {
          layoutInProgress = false;
          return await measureAndPack(true)
        }
      }

      // Add animations after computed grid placements valid
    } finally {
      // Reveal grid once layout is stable
      if(gridEl.value) {
        // Only apply buffer system when NOT filtered
        if(numCols.value > 3 && !timelineFiltered.value) {
          ensureColumnBuffers(gridEl.value, numCols.value)
          const initArr: number[] = [];
          for(let i = 0; i < numCols.value; i++) initArr.push(BUFFER_ROWS)
          setBufferSpans(gridEl.value, initArr)
          gridEl.value.style.setProperty('--grid-shift-y', `-${(BUFFER_ROWS + 1) * rowHeight}px`);
          if(gridWrapEl.value) gridWrapEl.value.style.marginBottom = `-${BUFFER_ROWS * rowHeight}px`;
        } else {
          // Clear buffer effects when filtered
          gridEl.value.style.setProperty('--grid-shift-y', '0px');
          if(gridWrapEl.value) gridWrapEl.value.style.marginBottom = '0px';
        }
        gridEl.value.style.opacity = '1';
      }


      // Fine-tune image max heights (CSS var based) after layout settles
      nudgeImageMaxHeights(gridEl.value as HTMLElement);

      // Add initial transform class so IntersectionObserver can animate them in
      liElements.forEach(el => {
        if (el.dataset.isCovid === '1') el.classList.add('covid-transform');
        else if (!el.dataset.animated && !el.classList.contains('grid-buffer-col')) el.firstElementChild?.classList.add('transform');
      });

      // Start intersection-based reveal animations
      cardAnimation();
      layoutInProgress = false;
    }

  } finally {
    // Safety: ensure we never leave layoutInProgress stuck on
    if (gridEl.value) gridEl.value.style.opacity = '1';
    layoutInProgress = false;
  }
}

/* === Small helpers used across layout === */
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

function parsePct(pct: string, fallback = 50) {
  const n = parseFloat(pct);
  return Number.isFinite(n) ? n : fallback;
}

/* Placeholder detection used to skip fake images in AR/max height logic */
function isPlaceholderImage(src: string | null): boolean {
  if (!src) return true;

  const s = src.toLowerCase();

  return (
      s.endsWith('/placeholder.png') ||
      s.includes('placeholder')
  );
}

function getMaxHeight(el: HTMLElement) {
  if(!el) return null;
  const text = el.querySelector('.text-content');
  if(!text) return null;

  const textHeight = text.getBoundingClientRect().height;

  const percentOfCard = textHeight / el.getBoundingClientRect().height;

  const maxImgPercent = parseFloat((1 - percentOfCard).toFixed(2));

  return (maxImgPercent * 100);
}

/**
 * Iteratively nudges --imgMaxPct for images that are “too short” or “too tall”
 * This is a post-layout pass that helps fill card space visually.
 */
function nudgeImageMaxHeights(grid: HTMLElement, maxPasses = 10) {
  let pass = 0;

  const step = () => {
    pass++;

    // Only normal cards (skip covid + quotes)
    const items = Array.from(grid.querySelectorAll<HTMLElement>('li.bento-card'))
        .filter(el => el.dataset.isCovid !== '1' && el.dataset.isQuote !== '1');

    let changed = 0;

    for (const li of items) {
      const img = li.querySelector<HTMLImageElement>('img');
      if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) continue;

      const src = img.getAttribute('src');
      if (img.dataset.placeholder === '1' || isPlaceholderImage(src)) continue;

      // cardRoot is where --imgMaxPct is applied (feature wrapper if present)
      const cardRoot =
          img.closest<HTMLElement>('.feature') ??
          img.closest<HTMLElement>('.bento-inner') ??
          li;

      // rendered size in layout
      const w = img.clientWidth;
      const h = img.clientHeight;
      if (w <= 0 || h <= 0) continue;

      // compare natural AR vs rendered AR
      const naturalAR  = img.naturalWidth / img.naturalHeight;
      const renderedAR = w / h;
      const ratio = renderedAR / naturalAR;

      const maxImgHeight = getMaxHeight(li) ?? 75;
      // current % value (defaults to 50)
      const cur = parsePct(cardRoot.style.getPropertyValue('--imgMaxPct') || '50');

      // adjust more aggressively if it’s very off
      const stepAmt =
          ratio > 1.25 ? 10 :
              ratio > 1.12 ? 6  :
                  ratio > 1.05 ? 4  :
                      0;

      // If rendered is “wider” than natural, bump max height
      if (stepAmt) {
        const next = clamp(cur + stepAmt, 30, maxImgHeight);
        if (next !== cur) {
          cardRoot.style.setProperty('--imgMaxPct', `${next}%`);
          changed++;
        }
      }
      // If rendered is “taller” than natural, reduce max height slightly
      else if (ratio < 0.92) {
        const next = clamp(cur - 6, 30, maxImgHeight);
        if (next !== cur) {
          cardRoot.style.setProperty('--imgMaxPct', `${next}%`);
          changed++;
        }
      }
    }

    // repeat a few times while adjustments are still changing layout
    if (changed > 0 && pass < maxPasses) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* Quote spans are fixed rules based on column count */
function setQuoteSpan(card: HTMLElement, grid: HTMLElement) {
  if (!card || !grid) return;

  if (numCols.value >= 5) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = 'span 4';
    card.dataset.rowspan = '4';
  } else if (numCols.value === 4) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = 'span 3';
    card.dataset.rowspan = '3';
  } else if (numCols.value === 3) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = 'span 3';
    card.dataset.rowspan = '3';
  } else if (numCols.value === 2) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = 'span 3';
    card.dataset.rowspan = '3';
  } else {
    // 1-col mobile: just make it taller
    card.style.gridColumn = 'span 1';
    card.dataset.colspan = '1';
    card.style.gridRowEnd = 'span 4';
    card.dataset.rowspan = '4';
  }
}

/* Desktop opens on hover; touch opens on tap */
function shouldOpenFromPointer(e: PointerEvent) {
  if (e.pointerType === 'mouse') return e.type === 'pointerenter';
  return e.type === 'pointerdown';
}

/**
 * Get bento grid placements
 * Produces (row, col, rowspan, colspan) by reading DOM rects.
 */
type Placement = {
  el: HTMLElement;
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
};
function getPlacements(grid: HTMLElement): Placement[] {
  // Grid metrics tell us pitch sizes for converting pixels -> rows/cols
  const { cols, rect, pitchY, pitchX } = getGridMetrics(grid);
  const EPS = 0.1;
  const items = Array.from(grid.querySelectorAll<HTMLElement>('li')).filter(el => !el.classList.contains('grid-buffer-col'))

  // Convert each element’s pixel position into grid row/col
  return items.map(el => {
    const cs = getComputedStyle(el);
    const colspan = parseInt(cs.getPropertyValue('--c')) ||
        parseInt(el.dataset.colspan || '1', 10) || 1;
    const rowspan = parseInt(cs.getPropertyValue('--r')) ||
        parseInt(el.dataset.rowspan || '1', 10) || 1;

    const r = el.getBoundingClientRect();
    const relLeft = r.left - rect.left;
    const relTop  = r.top  - rect.top;

    const col = Math.max(1, Math.min(cols, Math.floor((relLeft + EPS) / pitchX) + 1));
    const row = Math.max(1, Math.floor((relTop  + EPS) / pitchY) + 1);
    return { el, row, col, rowspan, colspan };
  });
}


/**
 * Check for gaps in grid
 * Returns true if any column has any unoccupied row ranges.
 */
function getBufferRows(grid: HTMLElement) {
  const cs = getComputedStyle(grid)
  const v = parseInt(cs.getPropertyValue('--buffer-rows') || '0', 10)
  return Number.isFinite(v) ? v : 0
}

function gapsPerCol(
    placements: Placement[],
    cols: number,
    ignoreTopRows = 0
) {
  for (let c = 1; c <= cols; c++) {
    const intervals = placements
        .filter(p => c >= p.col && c <= p.col + p.colspan - 1)
        .map(p => ({ start: p.row, end: p.row + p.rowspan - 1 }))
        .sort((a, b) => a.start - b.start || a.end - b.end)

    const merged: Array<{ start: number; end: number }> = []
    for (const iv of intervals) {
      if (!merged.length || iv.start > merged[merged.length - 1].end + 1) {
        merged.push({ ...iv })
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end)
      }
    }

    // ignore the top “buffer” region
    let prevEnd = ignoreTopRows

    for (const iv of merged) {
      if (iv.start > prevEnd + 1) return true
      prevEnd = Math.max(prevEnd, iv.end)
    }
  }

  return false
}



/**
 * Get grid data
 * Used by placement math (pixel -> row/col conversion).
 */
function getGridMetrics(grid: HTMLElement) {
  const cs   = getComputedStyle(grid);
  const cols = parseInt(cs.getPropertyValue('--cols')) || 1;
  const rowH = parseFloat(cs.getPropertyValue('--row-h')) || 1;
  const gap  = parseFloat(cs.gap) || 0;
  const rect = grid.getBoundingClientRect();
  const colW = (rect.width - gap * (cols - 1)) / cols;
  const pitchY = rowH + gap;
  const pitchX = colW + gap;
  return { cols, rect, pitchY, pitchX };
}

/**
 * Clear bento card transforms
 * Needed because transforms affect getBoundingClientRect (placement accuracy).
 */
function clearTransforms<T>(grid: HTMLElement, fn: () => T): T {
  const liElements = Array.from(
      grid.querySelectorAll<HTMLElement>('li.bento-card')
  )
  const saved = liElements.map(el => el.style.transform)
  liElements.forEach(el => (el.style.transform = ''))
  const out = fn()
  liElements.forEach((el, i) => (el.style.transform = saved[i]))
  return out
}


/**
 * Check openings below/above cards
 * Used by gap-fill passes to see if a card can grow downward.
 */
function clearanceRowsBelow(me: Placement, placements: Placement[]): number {
  const bandL = me.col;
  const bandR = me.col + me.colspan - 1;
  const startRowBelow = me.row + me.rowspan;
  let nearestDelta: number | null = null;

  for (const p of placements) {
    if (p === me) continue;
    const pL = p.col, pR = p.col + p.colspan - 1;
    const overlaps = !(pL > bandR || pR < bandL);
    if (!overlaps) continue;
    const delta = p.row - startRowBelow;
    if (delta >= 0 && (nearestDelta === null || delta < nearestDelta)) {
      nearestDelta = delta;
    }
  }
  return nearestDelta === null ? Number.POSITIVE_INFINITY : nearestDelta;
}

function firstBlockerBelowInBand(me: Placement, placements: Placement[]): Placement | null {
  const bandL = me.col;
  const bandR = me.col + me.colspan - 1;
  const startRowBelow = me.row + me.rowspan;

  let best: Placement | null = null;
  for (const p of placements) {
    if (p === me) continue;
    const pL = p.col, pR = p.col + p.colspan - 1;
    const overlaps = !(pL > bandR || pR < bandL);
    if (!overlaps) continue;

    const delta = p.row - startRowBelow;
    if (delta >= 0 && (!best || delta < (best.row - startRowBelow))) {
      best = p;
    }
  }
  return best;
}

/**
 * Grow single column cards with max row count
 * Pass 1: if there is exactly 1 empty row below, grow by 1.
 */
async function growSinglesByOne(maxRowSpan = 8) {
  await nextTick();
  if (!gridEl.value) return;
  const placements = clearTransforms(gridEl.value, () => getPlacements(gridEl.value as HTMLElement));

  // process top/bottom so upper cards fill their gap first
  placements.sort((a,b) => (a.row - b.row) || (a.col - b.col));

  for (const me of placements) {
    if (
        me.rowspan >= maxRowSpan ||
        (parseFloat(me.el.dataset.ar || '1.5') >= 1.35 && me.rowspan >= 6)
    ) continue;
    const emptyBelow = clearanceRowsBelow(me, placements);

    if (emptyBelow === 1) {
      const next = Math.min(maxRowSpan, me.rowspan + 1);
      // write back the new span
      me.el.style.gridRowEnd = `span ${next}`;
      me.el.dataset.rowspan = String(next);
      me.rowspan = next;
    }
  }
}

/**
 * Pass 2: if there are exactly 2 empty rows, grow qualifying cards by 1.
 * (Only if a 1-col card is involved to avoid breaking bigger layouts.)
 */
async function growAcrossTwoEmptyRows(maxRowSpan = 8) {
  await nextTick();
  if (!gridEl.value) return;
  const placements = clearTransforms(gridEl.value, () => getPlacements(gridEl.value as HTMLElement));

  // process from top to bottom so upper cards consume their gaps first
  placements.sort((a,b) => (a.row - b.row) || (a.col - b.col));

  for (const me of placements) {
    if (
        me.rowspan >= maxRowSpan ||
        (parseFloat(me.el.dataset.ar || '1.5') >= 1.15 && me.rowspan >= 6)
    ) continue;

    const emptyBelow = clearanceRowsBelow(me, placements);
    if (emptyBelow !== 2) continue;

    const below = firstBlockerBelowInBand(me, placements);
    const meIs1Col = me.colspan === 1;
    const belowIs1Col = !!below && below.colspan === 1;

    // Only act if either side is 1-col
    if (!meIs1Col && !belowIs1Col) continue;

    // Grow any qualifying 1-col participants by +1, respecting max
    const growMe = meIs1Col && me.rowspan < maxRowSpan;
    const growBelow = belowIs1Col && below!.rowspan < maxRowSpan;

    if (!growMe && !growBelow) continue;

    if (growMe) {
      const next = Math.min(maxRowSpan, me.rowspan + 1);
      me.el.style.gridRowEnd = `span ${next}`;
      me.el.dataset.rowspan = String(next);
      me.rowspan = next;
    }

    if (below && growBelow) {
      const next = Math.min(maxRowSpan, below.rowspan + 1);
      below.el.style.gridRowEnd = `span ${next}`;
      below.el.dataset.rowspan = String(next);
      below.rowspan = next;
    }
  }

  // Special tweak: if any card grows too tall, reduce image height
  Array.from(gridEl.value.querySelectorAll('li')).forEach(el => {
    const rows = parseInt(el.dataset.rowspan || '1');

    if(rows > 6) {
      const img = el.querySelector('img');
      if(!img) return;
      img.style.height = '50%';
    }
  })
}


/**
 * Set covid span/columns depending on column count
 * (Base/collapsed size before expansion animation.)
 */
function setCovidSpan(card: HTMLElement, grid: HTMLElement) {
  if(!card || !grid) return;
  switch(numCols.value) {
    case 1:
      card.style.gridColumn = 'span 1';
      card.dataset.colspan = '1';
      card.style.gridRowEnd = 'span 3';
      card.dataset.rowspan = '3';
      break;

    case 2:
      card.style.gridColumn = 'span 2';
      card.dataset.colspan = '2';
      card.style.gridRowEnd = 'span 3';
      card.dataset.rowspan = '3';
      break;

    case 3:
      card.style.gridColumn = 'span 3';
      card.dataset.colspan = '3';
      card.style.gridRowEnd = 'span 3';
      card.dataset.rowspan = '3';
      break;

    case 4:
    case 5:
    default:
      card.style.gridColumn = 'span 2';
      card.dataset.colspan = '2';
      card.style.gridRowEnd = 'span 4';
      card.dataset.rowspan = '4';
      break;
  }
}

// ------------------------
// COVID state + helpers
// ------------------------

type CovidMode = 'grow' | 'span'
type CovidState = 'idle' | 'opening' | 'open' | 'closing'

const covid = {
  state: 'idle' as CovidState,
  mode: null as CovidMode | null,
  active: null as HTMLElement | null,
}

function getCovidMode(): CovidMode {
  // Breakpoint rule: desktop = span, smaller = grow
  return numCols.value > 3 ? 'span' : 'grow'
}

function getCovidParts(covidCard: HTMLElement) {
  const inner = covidCard.querySelector<HTMLElement>('.covid-inner')
  const title = covidCard.querySelector<HTMLElement>('#covid-title')
  const posts = Array.from(
      covidCard.querySelectorAll<HTMLElement>('.covid-inner .covid-post')
  )
  return { inner, title, posts }
}

function hidePostsStagger(posts: HTMLElement[]) {
  let delay = .6;
  posts.forEach(p => {
    p.style.setProperty('--delay', `${delay}s`);
    p.classList.remove('active');
    p.classList.add('inactive');
    delay -= .15;
    p.addEventListener('transitionend', () => p.style.display = 'none', {once:true});
  });
}

function showPostsStagger(posts: HTMLElement[]) {
  let delay = 0
  posts.forEach(p => {
    p.style.display = 'flex'
    p.style.setProperty('--delay', `${delay}s`)
    p.classList.remove('inactive')
    p.classList.add('active')
    delay += 0.15
  })
}

function armCovidCloseHandlers(
    covidCard: HTMLElement,
    touch: boolean,
    closeFn: () => void
) {
  const onLeaveMouse = () => closeFn()

  const onTapCardAgain = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return
    e.stopPropagation()
    closeFn()
  }

  const onOutsideTap = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return
    if (covidCard.contains(e.target as Node)) return
    closeFn()
  }

  // remove any previous listeners (safe)
  covidCard.removeEventListener('pointerleave', onLeaveMouse)
  covidCard.removeEventListener('pointerdown', onTapCardAgain)
  document.removeEventListener('pointerdown', onOutsideTap, true)

  covidCard.addEventListener('pointerleave', onLeaveMouse)

  if (touch) {
    covidCard.addEventListener('pointerdown', onTapCardAgain)
    document.addEventListener('pointerdown', onOutsideTap, true)
  }
}

// ------------------------
// FLIP helper for grid reflow animation
// ------------------------

const COVID_FLIP_MS = 750;

function flipGrid(
    grid: HTMLElement,
    mutate: () => void,
    durationMs = COVID_FLIP_MS,
    covidCard: HTMLElement,
    closing = false
): Promise<void> {
  return new Promise((resolve) => {
    const items = Array.from(grid.querySelectorAll<HTMLElement>('li.bento-card'))

    const first = new Map(items.map(el => [el, el.getBoundingClientRect()]))

    mutate()
    grid.getBoundingClientRect();

    const last = new Map(items.map(el => [el, el.getBoundingClientRect()]))

    // Invert
    for (const el of items) {
      const a = first.get(el)!
      const b = last.get(el)!
      const dx = a.left - b.left
      const dy = a.top - b.top
      el.style.transition = 'none'
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    }

    grid.getBoundingClientRect() // paint

    // Play
    if (items.length === 0) return resolve()

    window.setTimeout(() => {
      for (const el of items) {
        el.style.transition = ''
        el.style.transform = ''
      }
      resolve()
    }, durationMs)
    if(!closing) {

    }

    let tween: gsap.core.Tween | null = null;

    const scroller =
        document.scrollingElement || document.documentElement; // usually <html>


    setTimeout(() => {
      const cleanup = () => {
        window.removeEventListener('wheel', stopScroll);
        window.removeEventListener('touchstart', stopScroll);
        window.removeEventListener('pointerdown', stopScroll);
        window.removeEventListener('keydown', stopScroll);
      }


      const stopScroll = () => {
        tween?.kill()
        cleanup();
      }

      window.addEventListener('wheel', stopScroll);
      window.addEventListener('touchstart', stopScroll);
      window.addEventListener('pointerdown', stopScroll);
      window.addEventListener('keydown', stopScroll);

      tween = $gsap.to(window, {
        duration: .75,
        scrollTo: {
          y: covidCard,
          offsetY: window.innerHeight / 2 - covidCard.offsetHeight / 2
        },
        onComplete: cleanup,
        onInterrupt: cleanup
      })



    }, Math.floor(durationMs / 1.75))




    for (const el of items) {
      el.style.transition = `transform ${durationMs}ms ease`
      el.style.transform = 'translate3d(0,0,0)'
    }


  })
}


const BUFFER_ROWS = 5;


// ------------------------
// Public attach / open / close
// ------------------------

function attachCovidOpen(covidCard: HTMLElement, grid: HTMLElement) {
  if ((covidCard as any).__covidBound) return
      ;(covidCard as any).__covidBound = true



  const openFromMouseHover = (e: PointerEvent) => {
    // Only hover-open for mouse
    if (e.pointerType !== 'mouse') return
    if (covid.state !== 'idle') return

    openCovid(covidCard, grid, false)
  }

  const openFromTouchTap = (e: PointerEvent) => {
    // Only tap-open for touch/pen
    if (e.pointerType === 'mouse') return
    if (covid.state !== 'idle') return
    e.stopPropagation()
    openCovid(covidCard, grid, true)
  }

  covidCard.addEventListener('pointerenter', openFromMouseHover)
  covidCard.addEventListener('pointerdown', openFromTouchTap, { passive: false })

  // Optional: open on keyboard focus for accessibility
  covidCard.addEventListener('focusin', () => {
    if (covid.state !== 'idle') return
    openCovid(covidCard, grid, false)
  })
}


function closeCovid(covidCard: HTMLElement, grid: HTMLElement) {
  if (covid.state !== 'open') return
  covid.state = 'closing'

  // Let mode-specific listeners handle the close path:
  covidCard.dispatchEvent(new Event('covid:close'))
}

// Open chooses grow vs span, then calls the specific function.
function openCovid(covidCard: HTMLElement, grid: HTMLElement, touch = false) {
  if (covid.state !== 'idle') return

  covid.state = 'opening'
  covid.active = covidCard
  covid.mode = getCovidMode()

  const onOpened = () => {
    covid.state = 'open'
    armCovidCloseHandlers(covidCard, touch, () => closeCovid(covidCard, grid))
  }

  const onClosed = () => {
    covid.state = 'idle'
    covid.active = null
    covid.mode = null
  }

  if (covid.mode === 'grow') {
    growCovidCard(covidCard, grid, touch, { onOpened, onClosed })
  } else {
    spanCovidCard(covidCard, grid, touch, { onOpened, onClosed }, numCols.value)
  }
}

// ------------------------
// GROW MODE
// ------------------------

function growCovidCard(
    covidCard: HTMLElement,
    grid: HTMLElement,
    touch = false, // kept for signature parity; grow itself doesn't need it now
    hooks: { onOpened: () => void; onClosed: () => void }
) {
  const placements = clearTransforms(grid, () => getPlacements(grid));

  const covidPlacement = placements.find(p => p.el === covidCard);
  if (!covidPlacement) {
    hooks.onClosed();
    return;
  }

  const initialHeight = covidCard.getBoundingClientRect().height;

  // cards above and below the covid row band
  const above = placements.filter(p => p.row < covidPlacement.row);
  const below = placements.filter(p => p.row > covidPlacement.row);

  const inner = covidCard.querySelector<HTMLElement>('.covid-inner');
  const covidTitle = covidCard.querySelector<HTMLElement>('#covid-title');
  if (!inner || !covidTitle) {
    hooks.onClosed();
    return;
  }

  const innerPosts: HTMLElement[] = Array.from(
      inner.querySelectorAll<HTMLElement>('.covid-post')
  );

  // reset inner to a known base state
  const prevTransition = inner.style.transition;
  const prevTransitionDelay = inner.style.transitionDelay;

  inner.style.transition = 'none';
  inner.style.transitionDelay = '0s';
  inner.style.height = '100%';
  inner.style.transform = 'none';

  // Ensure posts are in a consistent "closed" state
  innerPosts.forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
    p.classList.add('inactive');
  });

  // force reflow so browser applies these immediately
  void inner.offsetHeight;

  // enable the animated properties for the “open” motion
  inner.style.transition = 'height .75s ease, transform .75s ease-out';

  let closing = false;

  // push all above cards up and below cards down while covid expands
  above.forEach(p => {
    p.el.style.transform = `translateY(-${rowHeight * 2}px`;
  });
  below.forEach(p => {
    p.el.style.transform = `translateY(${rowHeight * 2}px`;
  });

  // ------------ OPEN: banner growth (height) ------------
  const finishOpen = () => {
    // Tell openCovid we're officially "open" (it arms the same close handlers as span)
    hooks.onOpened();

    // Grow must respond to programmatic closeCovid() (dispatches 'covid:close')
    covidCard.addEventListener(
        'covid:close',
        () => {
          if (closing) return;
          closing = true;
          startClose();
        },
        { once: true }
    );
  };

  const startInnerGrowth = () => {
    // hide title while expanded
    covidTitle.style.opacity = '0';

    // grow to a fixed “open” height
    inner.style.height = `${rowHeight * 8 - (gap * 2)}px`;

    inner.addEventListener(
        'transitionend',
        function grown(e) {
          if (e.propertyName !== 'height') return;
          inner.removeEventListener('transitionend', grown);

          // reveal posts with staggered animations
          let delay = 0;
          innerPosts.forEach(post => {
            post.style.display = 'flex';
            post.style.setProperty('--delay', `${delay}s`);
            post.classList.remove('inactive');
            post.classList.add('active');
            delay += 0.15;
          });

          if (!innerPosts.length) {
            finishOpen();
            return;
          }

          // allow closing after last post anim finishes
          innerPosts[innerPosts.length - 1].addEventListener(
              'animationend',
              () => finishOpen(),
              { once: true }
          );
        }
    );
  };

  startInnerGrowth();

  // ------------ CLOSE: reverse stagger + collapse ------------
  function startClose() {
    // reverse stagger so posts disappear in order
    let delay = innerPosts.length * 0.1;
    innerPosts.forEach(post => {
      post.style.setProperty('--delay', `${delay}s`);
      delay -= 0.1;
      post.classList.remove('active');
      post.classList.add('inactive');
    });

    // if there are no posts, collapse immediately
    if (!innerPosts.length) {
      collapse();
      return;
    }

    // wait for first post to finish animating out, then collapse
    innerPosts[0].addEventListener('animationend', () => collapse(), { once: true });
  }

  function collapse() {
    requestAnimationFrame(() => {
      if(!inner || !covidTitle) return;
      inner.style.transitionDelay = '1.25s';
      inner.style.height = `${initialHeight}px`;
      inner.style.transition = 'height 1s ease, transform .75s ease';

      // hide posts once collapsed (or while collapsing—your old behavior)
      innerPosts.forEach(post => {
        post.style.display = 'none';
      });

      // show title again
      covidTitle.style.opacity = '1';

      // clear neighbor transforms
      Array.from(
          document
          .querySelectorAll<HTMLElement>('.bento-card'))
          .forEach(el => el.style.transform = '')

      // cleanup + return to idle via shared hook
      inner.addEventListener('transitionend', () => {
        setTimeout(() => {
          inner.style.transition = prevTransition;
          inner.style.transitionDelay = prevTransitionDelay;

          hooks.onClosed();
        }, 750)

      }, {once:true})
    });
  }
}


function computeBufferSpansForCovidSpan(
    grid: HTMLElement,
    covidCard: HTMLElement,
    cols: number,
    bufferRows: number,
    upBias = 1.35
) {
  setBufferSpans(grid, Array(cols).fill(bufferRows));

  const placements = clearTransforms(grid, () => getPlacements(grid));
  const covid = placements.find(p => p.el === covidCard);
  if (!covid) return Array(cols).fill(bufferRows);

  const covidTop = covid.row;
  const covidBot = covid.row + covid.rowspan - 1;
  const covidMid = covidTop + (covid.rowspan - 1) / 2;

  // Separate needs: rows to free that help "up" vs "down"
  const needUp = Array(cols).fill(0);
  const needDown = Array(cols).fill(0);

  // Track top-2 overlaps per col (rows)
  const max1 = Array(cols).fill(0);
  const max2 = Array(cols).fill(0);

// when process overlapRows for a col index i:
  function pushOverlap(i: number, overlapRows: number) {
    if (overlapRows > max1[i]) {
      max2[i] = max1[i];
      max1[i] = overlapRows;
    } else if (overlapRows > max2[i]) {
      max2[i] = overlapRows;
    }
  }


  for (const p of placements) {
    if (p.el === covidCard) continue;

    const pTop = p.row;
    const pBot = p.row + p.rowspan - 1;

    const overlapRows = Math.max(
        0,
        Math.min(pBot, covidBot) - Math.max(pTop, covidTop) + 1
    );
    if (overlapRows <= 0) continue;

    const center = pTop + (p.rowspan - 1) / 2;

    // If card center is below mid, prefer it moves UP (so it doesn't push covid down).
    const wantsUp = center >= covidMid;

    const colStart = p.col;
    const colEnd = p.col + p.colspan - 1;

    for (let c = colStart; c <= colEnd; c++) {
      if (c < 1 || c > cols) continue;
      const i = c - 1;
      if (wantsUp) needUp[i] = Math.max(needUp[i], overlapRows);
      else needDown[i] = Math.max(needDown[i], overlapRows);
    }
  }

  // Combine with bias:
  // - Up needs count MORE (free more space -> more upward movement)
  // - Down needs count LESS
  const needFreeByCol = Array(cols).fill(0);
  for (let i = 0; i < cols; i++) {
    const up = needUp[i] * upBias;
    const down = needDown[i] * 1.0; // keep down as baseline
    needFreeByCol[i] = Math.ceil(Math.max(up, down));
  }

  // Propagate across multi-column cards
  let changed = true;
  let guard = 0;

  while (changed && guard++ < 10) {
    changed = false;

    for (const p of placements) {
      if (p.el === covidCard || p.colspan <= 1) continue;

      const colStart = p.col;
      const colEnd = p.col + p.colspan - 1;

      let maxNeed = 0;
      for (let c = colStart; c <= colEnd; c++) {
        if (c >= 1 && c <= cols) maxNeed = Math.max(maxNeed, needFreeByCol[c - 1]);
      }

      for (let c = colStart; c <= colEnd; c++) {
        if (c < 1 || c > cols) continue;
        if (needFreeByCol[c - 1] !== maxNeed) {
          needFreeByCol[c - 1] = maxNeed;
          changed = true;
        }
      }
    }
  }

  const SHAVE_PASSES = 5;

  for (let pass = 0; pass < SHAVE_PASSES; pass++) {
    for (let i = 0; i < cols; i++) {
      if (needFreeByCol[i] > 0 && (needFreeByCol[i] - 1) > max2[i]) {
        needFreeByCol[i] -= 1;
      }
    }
  }



  // Clamp + convert to spans
  return needFreeByCol.map(rowsToFree => {
    const span = bufferRows - rowsToFree;
    return Math.max(0, Math.min(bufferRows, span));
  });
}

// ------------------------
// SPAN MODE
// ------------------------
// This does:
// 1) FLIP toggle .covid-open (grid-column: 1/-1) so OTHER CARDS ANIMATE into place
// 2) Expand inner banner width to full grid
// 3) Close reverses: stagger hide posts -> shrink inner -> FLIP remove .covid-open
async function spanCovidCard(
    covidCard: HTMLElement,
    grid: HTMLElement,
    touch = false,
    hooks: { onOpened: () => void; onClosed: () => void },
    cols: number
) {
  const { inner, title, posts } = getCovidParts(covidCard)
  if (!inner || !title) {
    hooks.onClosed()
    return
  }

  console.log('inline', grid.style.transform)

  let cardRect = covidCard.getBoundingClientRect();
  const gridRect = grid.getBoundingClientRect();
  const initialWidth = cardRect.width
  let closing = false
  inner.style.transition = 'none'
  inner.style.width = `${initialWidth}px`;
  inner.style.transform = 'none'
  inner.style.transitionDelay = '0s'
  void inner.offsetWidth

  await nextTick();

  ensureColumnBuffers(grid, cols)




  // ---------- OPEN: FLIP re-pack + span covid ----------
  await flipGrid(grid, () => {
    //setBufferSpans(grid, spansByCol)
    covidCard.classList.add('covid-open');
    },
    undefined,
    covidCard
  )



  // expand banner + reveal posts
  requestAnimationFrame(() => {

    const gridRect = grid.getBoundingClientRect()
    const innerRect = inner.getBoundingClientRect()

    const distFromLeft = innerRect.left - gridRect.left
    const fullWidth = gridRect.width

    const willAnimate =
        Math.abs(distFromLeft) > 0.5 ||
        Math.abs(innerRect.width - fullWidth) > 0.5

    inner.style.transition = 'width 750ms ease-out, transform 750ms ease-out'
    title.style.opacity = '0'

    const reveal = () => {
      showPostsStagger(posts)

      if (!posts.length) {
        hooks.onOpened()
        return
      }

      posts[posts.length - 1].addEventListener('animationend', () => {
        setTimeout(() => {
          armCovidCloseHandlers(covidCard, touch, () => { void doClose() })
          covidCard.addEventListener('covid:close', (() => { void doClose() }) as EventListener, { once: true })
        }, 250);
        hooks.onOpened();
      }, {once:true})
    }

    inner.style.transform = `translateX(${-distFromLeft}px)`
    inner.style.width = `${fullWidth}px`


    if (!willAnimate) requestAnimationFrame(reveal)
    else {
      const onExpanded = (e: TransitionEvent) => {
        if (e.propertyName !== 'width') return
        inner.style.left = '0';
        inner.style.top = '0'
        inner.removeEventListener('transitionend', onExpanded)
        setTimeout(reveal, 250)
      }
      inner.addEventListener('transitionend', onExpanded)
    }
  })

  const doClose = async () => {
    if (closing) return
    closing = true

    let delay = posts.length * 0.1
    posts.forEach(p => {
      p.style.setProperty('--delay', `${delay}s`)
      delay -= 0.1
      p.classList.remove('active')
      p.classList.add('inactive')
    })

    requestAnimationFrame(() => {
      hidePostsStagger(posts);




      const onPostsOut = async () => {
        console.log('hey', initialWidth)
        inner.style.transitionDelay = '0.25s'
        inner.style.width = `${initialWidth}px`;
        inner.style.transform = 'none'

        title.style.opacity = '1'


        const full = Array(cols).fill(BUFFER_ROWS)

        setTimeout(async () => {
          await flipGrid(grid, () => {
            setBufferSpans(grid, full)

            covidCard.classList.remove('covid-open')
            covidCard.style.gridColumn = ''
            setCovidSpan(covidCard, grid)

            grid.classList.remove('covid-open');
            },
            undefined,
            covidCard,
            true
          )
        }, 250)



        inner.addEventListener('transitionend', onCollapse, {once:true})

      }
      posts[0].addEventListener('animationend', onPostsOut, {once:true});

      const onCollapse = () => {
        setTimeout(() => {
          hooks.onClosed();
        }, 1000)
      }

    })
  }


}




/**
 * Calculate translate for cards in covid row
 * Adds/updates translateY while keeping other transforms intact.
 */
function mergeTranslateY(transformStr: string, y: number) {
  // Treat 'none' as empty
  const safe = (transformStr || '').trim();
  const base = (safe === 'none' ? '' : safe)
      // remove any existing translateY
      .replace(/translateY\([^)]*\)\s*/g, '')
      .trim();

  return (base ? `${base} ` : '') + `translateY(${y}px)`;
}

/**
 * Set by-card animations
 * IntersectionObserver reveals cards by removing transform + setting opacity.
 */
function cardAnimation() {
  const cards = document.querySelectorAll<HTMLElement>('.bento-card');


  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const card = <HTMLElement> entry.target;
        card.dataset.isCovid === '1' ? card.classList.remove('covid-transform') : card.firstElementChild?.classList.remove('transform');
        card.style.opacity = '1';
        card.dataset.animated = 'true';
        observer.unobserve(entry.target);
      }
    })
  }, {threshold: .2});

  // Initialize hidden state for cards that haven’t animated yet
  cards.forEach(card => {
    if(card.dataset.animated === 'true') return;
    card.style.opacity = '0';
    observer.observe(card);
  })
}

function ensureColumnBuffers(grid: HTMLElement, cols: number) {
  // remove extras
  const existing = Array.from(grid.querySelectorAll<HTMLElement>('.grid-buffer-col'))
  existing.forEach((el, i) => {
    if (i >= cols) el.remove()
  })

  // create missing
  const current = Array.from(grid.querySelectorAll<HTMLElement>('.grid-buffer-col'))
  for (let c = current.length + 1; c <= cols; c++) {
    const li = document.createElement('li')
    li.className = 'grid-buffer-col'
    li.setAttribute('aria-hidden', 'true')
    // insert at very top so auto-placement sees them first
    grid.insertBefore(li, grid.firstChild)
  }

  // set each buffer's column index
  const buffers = Array.from(grid.querySelectorAll<HTMLElement>('.grid-buffer-col'))
  buffers.forEach((buf, idx) => {
    buf.style.setProperty('--buf-col', String(idx + 1))
  })
}

function setBufferSpans(grid: HTMLElement, spansByCol: number[]) {
  const buffers = Array.from(grid.querySelectorAll<HTMLElement>('.grid-buffer-col'))
  buffers.forEach((buf, i) => {
    buf.style.setProperty('--buf-span', String(BUFFER_ROWS))
  })
}


/**
 * Update column count on resize
 * Also triggers rebuild when breakpoint changes.
 */
function updateColumns() {
  const width = window.innerWidth;

  if (width >= 1700) numCols.value = 5
  else if (width >= 1380) numCols.value = 4
  else if (width >= 1024) numCols.value = 3
  else if (width >= 640) numCols.value = 2
  else numCols.value = 1;
  // Only rebuild if column count actually changed
  if(cols !== numCols.value) {
    cols = numCols.value;
    hardRebuild();
  }
}

/* === Post sorting and filtering === */
const postsArray = computed(() => {
  if (Array.isArray(posts.value)) {
    return posts.value.slice().sort((a: Post, b: Post) => {
      const yearA: number = parseInt(a.eventOptions?.eventYear) || 0;
      const yearB: number = parseInt(b.eventOptions?.eventYear) || 0;
      return yearB - yearA;
    });
  }
  return [] as Post[];
});

const postsFilteredByCategory = computed(() => {
  if (store.timelineFilterCategory) {

    return postsArray.value.filter((post: Post) => {
      return post.categories.nodes.some((cat: Category) =>
          cat.slug === store.timelineFilterCategory?.slug
      );
    });
  }
  return postsArray.value;
});

/* Search term filtering (title match) */
const filteredPostsBase = computed<Post[]>(() => {
  const base = postsFilteredByCategory.value;
  const term = store.searchTerm.trim().toLowerCase();
  if(!term) return base;

  return base.filter((post: Post) =>
      post.title.toLowerCase().includes(term)
  );
})

/* Quote spacing “interval” (how often to insert a quote) */
const quoteInterval = computed(() => {
  const total = filteredPostsBase.value.length;
  if (total === 0) return 6;

  const quoteCount = filteredPostsBase.value.filter(
      post => post.eventOptions?.postType === 'quote'
  ).length;

  if (quoteCount === 0) return Number.POSITIVE_INFINITY;

  const raw = total / (quoteCount + 2);
  return Math.max(1, Math.round(raw));
});

/* Interleave quotes into default posts so quotes don’t clump together */
function spaceQuotes(base: Post[]): Post[] {
  if (!base.length) return [];

  const quotePosts = base.filter(p => p.eventOptions?.postType === 'quote' && !p.eventOptions?.quoteYear);
  const defaultPosts = base.filter(p => p.eventOptions?.postType !== 'quote');

  if (!quotePosts.length) return defaultPosts; // keep original order without quotes

  const interval = Math.max(1, Math.round(base.length / quotePosts.length));

  const result: Post[] = [];
  let q = 0, d = 0, since = 0;

  // optional: if you want the first quote to appear later, increase this
  const firstQuoteOffset = 1;
  let firstPlaced = false;

  while (d < defaultPosts.length) {
    result.push(defaultPosts[d++]);
    since++;

    const shouldPlaceFirst = !firstPlaced && since >= firstQuoteOffset && q < quotePosts.length;
    const shouldPlaceNext  = firstPlaced && since >= interval && q < quotePosts.length;

    if (shouldPlaceFirst || shouldPlaceNext) {
      result.push(quotePosts[q++]);
      firstPlaced = true;
      since = 0;
    }
  }

  // append remaining quotes at the end
  while (q < quotePosts.length) result.push(quotePosts[q++]);
  return result;
}

/* Collect covid posts separately */
const covidPosts = computed(() => {
  return filteredPostsBase.value.filter(
      post => post.eventOptions?.postType === 'covid_post'
  );
})

const COVID_YEAR = 2020;

/* Used by layout code to decide if covid wrapper should exist */
let shouldMakeCovid = true;

/**
 * Build the final list:
 * - nonCovid posts
 * - with quotes spaced in
 * - with a COVID wrapper injected at the 2020 position (if allowed)
 */
const timelineItems = computed<TimelineItem[]>(() => {
  const nonCovid = filteredPostsBase.value.filter(
      p => p.eventOptions?.postType !== 'covid_post'
  );
  const quotesWithYears = filteredPostsBase.value.filter(
      p => p.eventOptions?.postType === 'quote' && p.eventOptions?.quoteYear
  );

  const covid = covidPosts.value;
  const hasCovid = covid.length > 0;

  if (!nonCovid.length && !hasCovid) return [];

  // only insert covid wrapper when viewing the full timeline (not filtered)
  shouldMakeCovid = filteredPostsBase.value.length >= postsArray.value.length;

  const result: TimelineItem[] = [];

  if(shouldMakeCovid) {
    // space quotes across the entire timeline (quotes can move across years)
    const spaced = spaceQuotes(nonCovid);

    // insert covid wrapper at 2020 position
    let insertAt = spaced.findIndex(p => {
      const year = parseInt(p.eventOptions?.eventYear || '0', 10);
      return year <= COVID_YEAR;
    });
    if (insertAt === -1) insertAt = spaced.length;

    for (let i = 0; i < spaced.length; i++) {
      if(hasCovid && i === insertAt) {
        result.push({ type: 'covid', year: COVID_YEAR, posts: covid });
      }
      result.push({ type: 'post', post: spaced[i] });
    }

    // if covid should be last, append it
    if (hasCovid && insertAt === spaced.length) {
      result.push({ type: 'covid', year: COVID_YEAR, posts: covid });
    }

  } else {
    // when filtered, keep list simple: just spaced posts
    const spaced = spaceQuotes(filteredPostsBase.value);

    for(let i = 0; i < spaced.length; i++) {
      result.push({ type: 'post', post: spaced[i]})
    }
  }

  if(quotesWithYears.length > 0) {
    quotesWithYears.forEach(quote => {
      const qYear = parseInt(quote.eventOptions?.quoteYear || '0', 10)

      let insertAt = result.findIndex(p =>
          p.type !== 'covid' &&
          parseInt(p.post.eventOptions?.eventYear || '0', 10) <= qYear
      );

      if (insertAt === -1) insertAt = result.length;
      else insertAt++;
      if(insertAt) {
        const quoteItem: TimelineItem = { type: 'post', post: quote }
        result.splice(insertAt, 0, quoteItem)
      }
    })
  }

  return result;
});

/* Legacy/extra filteredPosts computed (still used in watcher below) */
const filteredPosts = computed(() => {
  return postsFilteredByCategory.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : postsFilteredByCategory.value;
  });
});


/**
 * On mount:
 * - set initial columns
 * - listen for resize
 * - animate title when it enters viewport
 */
onMounted( async () => {
  await nextTick();
  updateColumns();
  if (numCols.value > 3 && gridEl.value) {
    const initArr: number[] = [];
    for (let i = 0; i < numCols.value; i++) initArr.push(BUFFER_ROWS)
    setBufferSpans(gridEl.value, initArr);
  }

  document.addEventListener('pointerdown', () => {
    canPlayQuotes.value = true
  }, {once: true})

  window.addEventListener('resize', () => {
    updateColumns();
  });

  if(titleEl.value) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('animated');
          io.unobserve(entry.target);
        }
      })
    }, { threshold: .8})
    io.observe(titleEl.value);
  }


})

/**
 * Watch posts/filters:
 * - first run: just measure/pack
 * - later runs: hard rebuild so spans + covid logic reset cleanly
 */
let first = false;
let pdfGenerated = false;
watch([filteredPosts], async () => {
  //if(!pdfGenerated && filteredPosts.value.length !== 0) await generateDocx(filteredPosts.value);
  await nextTick();

  if(!first) {
    requestAnimationFrame(() => measureAndPack());
    first = true;
  } else {
    requestAnimationFrame(async() => {
      await nextTick()
      if(layoutInProgress) layoutInProgress = false;
      await hardRebuild();
    });
  }
}, {immediate:true, flush: 'post'});
</script>
