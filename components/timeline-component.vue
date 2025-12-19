<style scoped>
/* === Core bento grid layout (CSS grid “masonry-ish”) === */
.bento-grid {
  display: grid;
  grid-auto-flow: row dense; /* lets items backfill gaps */
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-auto-rows: var(--row-h, 115px);
  gap: var(--gap, 25px);
  overflow-y: clip;
}

/* Used while recomputing layout to avoid flicker */
.bento-grid.computing {
  opacity: 0;
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
  transition: transform 1s, opacity .75s;
}

/* Most cards are interactive; special ones override */
.bento-card:not(.covid-card) {
  cursor: pointer;
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
  transition: transform 1.25s, opacity .75s;
  transition-delay: .25s;
  position: relative;
}

/* Inner “banner” that expands (width on desktop / height on small cols) */
.covid-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  transition-delay: .25s;
  transition: width .75s ease-out, transform .75s ease-out;
  background: url("../public/covid-event-bg.png") no-repeat center bottom;
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
@media(max-width: 1280px) {
  .covid-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    transform: translateY(-50%);
    top: 50%
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
/* (empty global style block - left as-is) */
</style>

<template>
  <!-- NOTES
    Set covid modal to disable until initial transition end + cards 2 rows under
  -->

  <!-- Page wrapper -->
  <div class="mb-36 px-2 py-12 md:px-12 overflow-x-hidden" style="width: 99vw">

    <!-- Title -->
    <h1 class="text-blue-950 text-3xl sm:text-4xl md:text-5xl lg:text-6xl
    xl:text-7xl 2xl:text-8xl font-black timeline-title dark:text-blue-300
    ps-3 md:ps-0
    "
    >CENTENNIAL TIMELINE</h1>

    <!-- Filters UI -->
    <section>
      <Filters />
    </section>

    <!-- Card Layout (CSS Grid) -->
    <section class="flex flex-col justify-around">

      <!-- Empty state -->
      <div v-if="timelineItems.length === 0">
        No posts found.
      </div>

      <!-- Grid wrapper (opacity toggled during rebuilds) -->
      <div ref="gridWrapEl" v-else>
        <ul
            :key="`grid-${rebuildToken}-${numCols}`"
            ref="gridEl"
            id="card-grid"
            class="bento-grid py-10"
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
                ? (item.post?.eventOptions?.cardSize ?? 'default')
                : 'large'"
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
    </section>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import 'gridstack/dist/gridstack.min.css';
import {useStore} from '~/stores/store';
import Card from "~/components/card.vue";
import Filters from "~/components/filters.vue";
import { generateDocx } from '@/composables/useDocGenerate';
import {fetchPosts, usePosts} from "~/composables/usePosts";

/**
 * Get post data + filter store
 */
const store = useStore();
const { data: posts } = usePosts();

/**
 * Grid sizing + layout state
 * - numCols drives spans and special behavior
 * - layoutInProgress prevents overlapping layout passes
 * - covidCardGrow ensures covid init runs once per rebuild
 */

const canPlayQuotes = ref(false);


const numCols = ref(5);
let cols = numCols.value;
let rowHeight = 115;
const gap = 25;
let layoutInProgress = false;
let covidCardGrow = false;

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

/* Timeline list is posts plus a special “covid group” item */
type TimelineItem =
    | { type: 'post'; post: Post }
    | { type: 'covid'; year: number; posts: Post[] }


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
  covidState.value = 'idle';
  if(gridWrapEl.value) gridWrapEl.value.style.opacity = '0';

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
        attachCovidOpen(covidLi)

        // set base span for the wrapper based on columns
        setCovidSpan(covidLi, gridEl.value as HTMLElement);
      }
    }

    // 1-column layout: keep it simple and uniform-ish
    if(numCols.value === 1) {
      liElements.forEach(el => {
        const rand = Math.random();
        const rowspan = rand < .75 ? 3 : 4;
        el.style.gridRowEnd = `span ${rowspan}`;
        el.dataset.rowspan = `${rowspan}`;
        el.style.gridColumn = 'span 1';
        el.dataset.colspan = '1';
      })
      cardAnimation();
      return;
    }

    // Very small sets: force consistent sizing so layout doesn’t look broken
    if(liElements.length < 10) {
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
          r = Math.floor(Math.random() * 2) + 4; // 4–5
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
      if (el.dataset.cardSize === 'large') r += 1;
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
      let emptyGaps = gapsPerCol(newPlacements, numCols.value);
      if(emptyGaps) {
        await nextFrame();

        await growSinglesByOne(8);
        await growAcrossTwoEmptyRows(8);
        await nextTick();

        newPlacements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement));
        await nextTick();
        const newEmpty = gapsPerCol(newPlacements, numCols.value);
        if(newEmpty) {
          layoutInProgress = false;
          return await measureAndPack(true)
        }
      }

      // Add animations after computed grid placements valid
    } finally {
      // Reveal grid once layout is stable
      if(gridEl.value) gridEl.value.style.opacity = '1';

      // Fine-tune image max heights (CSS var based) after layout settles
      nudgeImageMaxHeights(gridEl.value as HTMLElement);

      // Add initial transform class so IntersectionObserver can animate them in
      liElements.forEach(el => {
        if (el.dataset.isCovid === '1') el.classList.add('covid-transform');
        else if (!el.dataset.animated) el.classList.add('transform');
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
  const items = Array.from(grid.querySelectorAll<HTMLElement>('li'));

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
function gapsPerCol(placements: Placement[], cols:number) {
  const result: Record<number, Array<{start:number,end:number}>> = {};

  // For each column, build occupied intervals from all cards spanning that column
  for (let c = 1; c <= cols; c++) {
    const intervals = placements
        .filter(p => c >= p.col && c <= p.col + p.colspan - 1)
        .map(p => ({ start: p.row, end: p.row + p.rowspan - 1 }))
        .sort((a, b) => a.start - b.start || a.end - b.end);

    // Merge intervals so we can detect breaks cleanly
    const merged: Array<{start:number,end:number}> = [];
    for (const iv of intervals) {
      if (!merged.length || iv.start > merged[merged.length - 1].end + 1) {
        merged.push({ ...iv });
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end);
      }
    }

    // Any break between merged intervals is a gap
    const gaps: Array<{start:number,end:number}> = [];
    let prevEnd = 0;
    for (const iv of merged) {
      if (iv.start > prevEnd + 1) gaps.push({ start: prevEnd + 1, end: iv.start - 1 });
      prevEnd = iv.end;
    }

    // Store gaps per column (used only to decide “do we still have gaps?”)
    let maxRow = 0;
    for (const p of placements) {
      if (c >= p.col && c <= p.col + p.colspan - 1) {
        const endRow = p.row + p.rowspan - 1;
        if (endRow > maxRow) maxRow = endRow;
      }
    }
    result[c] = gaps;
  }

  // If any column has gaps, return true
  for(let r = 1; r <= cols; r++) {
    const gaps = result[r]
    if(gaps && gaps.length > 0) return true;
  }
  return false;
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
  const liElements = Array.from(document.querySelectorAll<HTMLElement>('.bento-card'));
  const saved = liElements.map(el => el.style.transform);
  liElements.forEach(el => el.style.transform = '');
  const out = fn();
  liElements.forEach((el, i) => { el.style.transform = saved[i] });
  return out;
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
    if (me.rowspan >= maxRowSpan) continue;
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
      card.dataset.rowspan = '3';
      break;
  }
}

// Track state of covid card
const covidState = ref<'idle' | 'opening' | 'open' | 'closing'>('idle');


/**
 * Attach open handlers to covid card
 * - mouse: open on hover
 * - touch: open on tap
 */
function attachCovidOpen(covidLi: HTMLElement) {
  const open = (e: PointerEvent) => {
    if (!shouldOpenFromPointer(e)) return;
    if (covidState.value !== 'idle') return;

    covidState.value = 'opening';

    // prevent global handlers from firing on touch
    if (e.pointerType !== 'mouse') e.stopPropagation();

    // remove open listeners until we close again
    covidLi.removeEventListener('pointerenter', open);
    covidLi.removeEventListener('pointerdown', open);

    requestAnimationFrame(() => {
      const isTouch = e.pointerType !== 'mouse';
      // small column counts expand vertically, larger expands horizontally
      if (numCols.value <= 3)
        growCovidCard(covidLi, gridEl.value as HTMLElement, isTouch);
      else
        spanCovidCard(covidLi, gridEl.value as HTMLElement, isTouch);
    });
  };

  covidLi.addEventListener('pointerenter', open);
  covidLi.addEventListener('pointerdown', open);
}

/* === Mobile/low-cols covid expansion: grow height and push stacks up/down === */
function growCovidCard(covidCard: HTMLElement, grid: HTMLElement, touch = false) {

  // measure placements without transforms for accurate “above/below” sets
  const placements = clearTransforms(grid, () =>
      getPlacements(grid)
  );

  const covidPlacement = placements.find(p => p.el === covidCard);
  if(!covidPlacement) {
    covidState.value = 'idle';
    return;
  }

  // cards above and below the covid row band
  const above = placements.filter(p => p.row < covidPlacement.row);
  const below = placements.filter(p => p.row > covidPlacement.row);

  const inner = covidCard.querySelector<HTMLElement>('.covid-inner');
  const covidTitle = covidCard.querySelector<HTMLElement>('#covid-title');
  if (!inner || !covidTitle) {
    covidState.value = 'idle';
    return;
  }

  // reset inner to a known base state
  const prevTransition = inner.style.transition;
  inner.style.transition = 'none';
  inner.style.height = '100%';
  // force reflow so browser applies these immediately
  void inner.offsetHeight;

  const gridRect = grid.getBoundingClientRect();
  const innerRect = inner.getBoundingClientRect();

  // now enable the animated properties for the “open” motion
  inner.style.transition = 'height .75s ease, transform .75s ease-out';

  const innerPosts: HTMLElement[] = Array.from(
      inner.querySelectorAll('.covid-post')
  );

  // ------------ PHASE 1: banner growth (height) ------------
  function startInnerGrowth() {
    if(!inner || !covidTitle) return;

    // hide title while expanded
    covidTitle.style.opacity = '0';

    // grow to a fixed “open” height
    inner.style.height = `${rowHeight * 8 - gap}px`;

    // once grown, reveal posts with staggered animations
    inner.addEventListener(
        'transitionend',
        function grown(e) {
          if (e.propertyName !== 'height') return;
          inner.removeEventListener('transitionend', grown);

          let delay = 0;
          innerPosts.forEach(covidPost => {
            covidPost.style.display = 'flex';
            covidPost.style.setProperty('--delay', `${delay}s`);
            covidPost.classList.replace('inactive', 'active');
            delay += 0.15;
          });

          if (!innerPosts.length) {
            armPointerLeave();
            return;
          }

          // allow closing after last post anim finishes
          innerPosts[innerPosts.length - 1].addEventListener(
              'animationend',
              function allowShrink() {
                covidState.value = 'open';
                armPointerLeave();
              },
              { once: true }
          );
        }
    );
  }

  // push all above cards up and below cards down while covid expands
  above.forEach(p => {
    p.el.style.setProperty('--to-move', `translateY(-${rowHeight * 2}px)`);
    p.el.classList.add('adjustForCovid');
  });
  below.forEach(p => {
    p.el.style.setProperty('--to-move', `translateY(${rowHeight * 2}px)`);
    p.el.classList.add('adjustForCovid');
  })

  startInnerGrowth();

  // ----------------- pointerleave + shrink -----------------
  function armPointerLeave() {
    const close = () => {
      if (covidState.value !== 'open') return;
      covidState.value = 'closing';

      // cleanup listeners
      covidCard.removeEventListener('pointerleave', onLeaveMouse);
      covidCard.removeEventListener('pointerdown', onTapCardAgain);
      document.removeEventListener('pointerdown', onOutsideTap, true);

      // reverse the stagger so cards disappear in order
      let delay = innerPosts.length * 0.1;
      innerPosts.forEach(covidPost => {
        covidPost.style.setProperty('--delay', `${delay}s`);
        delay -= 0.1;
        covidPost.classList.replace('active', 'inactive');
      });

      shrink();
    };

    const onLeaveMouse = () => close();

    // Tap again on the card to close (touch)
    const onTapCardAgain = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      e.stopPropagation();
      close();
    };

    // Tap anywhere else closes (touch)
    const onOutsideTap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (covidCard.contains(e.target as Node)) return;
      close();
    };

    covidCard.addEventListener('pointerleave', onLeaveMouse);

    if (touch) {
      covidCard.addEventListener('pointerdown', onTapCardAgain);
      // capture=true so it fires even if something stops bubbling later
      document.addEventListener('pointerdown', onOutsideTap, true);
    }
  }

  function shrink() {
    if(!inner || !covidTitle) return;

    // wait for first post to finish animating out, then collapse
    innerPosts[0].addEventListener('animationend', () => {
      requestAnimationFrame(() => {
        inner.style.transitionDelay = '1.25s';
        inner.style.height = '100%';
        inner.style.transition = 'height 1s ease, transform .75s ease'

        // hide posts once collapsed
        innerPosts.forEach(covidPost => {
          covidPost.style.display = 'none';
        });

        // show title again
        covidTitle.style.opacity = '1';

        // clear the neighbor transforms
        const liElements = Array.from(
            document.querySelectorAll<HTMLElement>('.bento-card')
        );
        liElements.forEach(el => {
          el.classList.remove('adjustForCovid');
        });

        // re-arm open listeners after a short delay
        setTimeout(() => {
          covidState.value = 'idle';
          attachCovidOpen(covidCard);
        }, 500);
      })
    }, {once:true})
  }
}

/**
 * Calculate cards in covid rows / move cards out of way / grow covid card
 */

/* === Desktop/high-cols covid expansion: expand width to full grid and shift overlaps === */
function spanCovidCard(covidCard: HTMLElement, grid: HTMLElement, touch = false) {
  const { pitchY } = getGridMetrics(grid);
  const placements = clearTransforms(grid, () =>
      getPlacements(grid)
  );

  const covidPlacement = placements.find(p => p.el === covidCard);
  if (!covidPlacement) {
    covidState.value = 'idle';
    return;
  }

  // covid row band in grid coordinates
  const covidTop = covidPlacement.row;
  const covidBot = covidPlacement.row + covidPlacement.rowspan - 1;
  const covidMid = covidTop + Math.floor(covidPlacement.rowspan / 2);

  const cTopPx = covidTop * pitchY;
  const cBotPx = (covidPlacement.row + covidPlacement.rowspan) * pitchY;

  // maps for stack shifts (per-column)
  const upByCol = new Map<number, number>();
  const downByCol = new Map<number, number>();

  // per-card shift (only for cards overlapping COVID rows)
  const perCardShift = new Map<HTMLElement, number>();

  // ---------- PASS 1: compute overlaps + decide shifts ----------
  for (const p of placements) {
    if (p.el === covidCard) continue;

    const pTop = p.row;
    const pBot = p.row + p.rowspan - 1;

    const overlapRows = Math.max(
        0,
        Math.min(pBot, covidBot) - Math.max(pTop, covidTop) + 1
    );
    const overlapPx = overlapRows * pitchY;

    const colStart = p.col;
    const colEnd = p.col + p.colspan - 1;

    if (overlapRows > 0) {
      // inside COVID rows: push away from covid center
      const center = pTop + (p.rowspan - 1) / 2;
      const delta = center < covidMid ? -overlapPx : overlapPx;
      perCardShift.set(p.el, delta);

      for (let c = colStart; c <= colEnd; c++) {
        if (delta < 0) {
          upByCol.set(c, Math.max(upByCol.get(c) ?? 0, overlapPx));
        } else {
          downByCol.set(c, Math.max(downByCol.get(c) ?? 0, overlapPx));
        }
      }
    } else {
      // track which cols have stacks above / below (for later stack shifting)
      if (pBot < covidTop) {
        for (let c = colStart; c <= colEnd; c++) {
          upByCol.set(c, Math.max(upByCol.get(c) ?? 0, 0));
        }
      } else if (pTop > covidBot) {
        for (let c = colStart; c <= colEnd; c++) {
          downByCol.set(c, Math.max(downByCol.get(c) ?? 0, 0));
        }
      }
    }
  }

  // ---------- PASS 2: apply computed shifts to cards ----------
  let anyShift = false;

  for (const p of placements) {
    if (p.el === covidCard) continue;

    let deltaY = perCardShift.get(p.el) ?? 0;

    if (deltaY === 0) {
      // stack shifting for cards fully above/below the covid band
      const pTopPx = p.row * pitchY;
      const pBotPx = (p.row + p.rowspan) * pitchY;

      let upPx = 0;
      let downPx = 0;

      for (let c = p.col; c <= p.col + p.colspan - 1; c++) {
        const upShift = upByCol.get(c) ?? 0;
        const downShift = downByCol.get(c) ?? 0;

        if (upShift > 0 && pBotPx <= cTopPx) {
          upPx = Math.max(upPx, upShift);
        }
        if (downShift > 0 && pTopPx >= cBotPx) {
          downPx = Math.max(downPx, downShift);
        }
      }

      // choose direction (prefer the larger movement)
      if (upPx > 0 && downPx === 0) {
        deltaY = -upPx;
      } else if (downPx > 0 && upPx === 0) {
        deltaY = downPx;
      } else if (upPx > 0 && downPx > 0) {
        deltaY = downPx >= upPx ? downPx : -upPx;
      }
    }

    if (deltaY !== 0) anyShift = true;

    // Store translateY into --to-move so CSS transition handles the movement
    p.el.style.setProperty(
        '--to-move',
        mergeTranslateY(p.el.style.transform || '', deltaY)
    );
    p.el.classList.add('adjustForCovid'); // CSS has transform transition
  }

  const inner = covidCard.querySelector<HTMLElement>('.covid-inner');
  const covidTitle = covidCard.querySelector<HTMLElement>('#covid-title');
  if (!inner || !covidTitle) {
    covidState.value = 'idle';
    return;
  }

  // reset inner to a known base state
  const prevTransition = inner.style.transition;
  inner.style.transition = 'none';
  inner.style.transform = 'none';
  inner.style.width = '100%';
  // force reflow so browser applies these immediately
  void inner.offsetWidth;

  // compute how far we need to translate to align to grid left edge
  const gridRect = grid.getBoundingClientRect();
  const innerRect = inner.getBoundingClientRect();
  const distFromLeft = innerRect.left - gridRect.left;
  const fullWidth = gridRect.width;

  // restore transitions
  inner.style.transition =
      prevTransition || 'width .75s ease-out, transform .75s ease-out';

  const innerPosts: HTMLElement[] = Array.from(
      inner.querySelectorAll('.covid-post')
  );

  // ------------ PHASE 2: banner expansion (width) ------------
  function startInnerExpansion() {
    if(!inner || !covidTitle) return;

    covidTitle.style.opacity = '0';
    inner.style.transitionDelay = '0s';

    // stretch banner to full width of grid
    inner.style.transform = `translateX(${-distFromLeft}px)`;
    inner.style.width = `${fullWidth}px`;

    // once banner expanded, reveal posts w/ stagger
    inner.addEventListener(
        'transitionend',
        function grown(e) {
          if (e.propertyName !== 'width') return;
          inner.removeEventListener('transitionend', grown);

          let delay = 0;
          innerPosts.forEach(covidPost => {
            covidPost.style.display = 'flex';
            covidPost.style.setProperty('--delay', `${delay}s`);
            covidPost.classList.replace('inactive', 'active');
            delay += 0.15;
          });

          if (!innerPosts.length) {
            armPointerLeave();
            return;
          }

          innerPosts[innerPosts.length - 1].addEventListener(
              'animationend',
              function allowShrink() {
                covidState.value = 'open';
                armPointerLeave();
              },
              { once: true }
          );
        }
    );
  }

  // Wait for the card shifts to finish before expanding the banner
  const SHIFT_DURATION_MS = 750;
  if (anyShift) {
    setTimeout(startInnerExpansion, SHIFT_DURATION_MS);
  } else {
    startInnerExpansion();
  }

  // ----------------- pointerleave + shrink -----------------
  function armPointerLeave() {
    const close = () => {
      if (covidState.value !== 'open') return;
      covidState.value = 'closing';

      // cleanup listeners
      covidCard.removeEventListener('pointerleave', onLeaveMouse);
      covidCard.removeEventListener('pointerdown', onTapCardAgain);
      document.removeEventListener('pointerdown', onOutsideTap, true);

      // reverse stagger: hide posts
      let delay = innerPosts.length * 0.1;
      innerPosts.forEach(covidPost => {
        covidPost.style.setProperty('--delay', `${delay}s`);
        delay -= 0.1;
        covidPost.classList.replace('active', 'inactive');
      });

      shrink();
    };

    const onLeaveMouse = () => close();

    // Tap again on the card to close (touch)
    const onTapCardAgain = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      e.stopPropagation();
      close();
    };

    // Tap anywhere else closes (touch)
    const onOutsideTap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (covidCard.contains(e.target as Node)) return;
      close();
    };

    covidCard.addEventListener('pointerleave', onLeaveMouse);

    if (touch) {
      covidCard.addEventListener('pointerdown', onTapCardAgain);
      document.addEventListener('pointerdown', onOutsideTap, true);
    }
  }

  function shrink() {
    if(!inner || !covidTitle) return;
    requestAnimationFrame(() => {
      // collapse banner back to card width
      inner.style.transitionDelay = '.5s';
      inner.style.width = '100%';
      inner.style.transform = 'none';

      inner.addEventListener(
          'transitionend',
          function shrunk(e) {
            if (e.propertyName !== 'width') return;
            inner.removeEventListener('transitionend', shrunk);
            inner.style.transitionDelay = 'unset';

            // hide posts once closed
            innerPosts.forEach(covidPost => {
              covidPost.style.display = 'none';
            });

            requestAnimationFrame(() => {
              // bring title back
              covidTitle.style.opacity = '1';

              // clear shifts for all cards
              const liElements = Array.from(
                  document.querySelectorAll<HTMLElement>('.bento-card')
              );
              liElements.forEach(el => {
                el.classList.remove('adjustForCovid');
              });

              // re-arm open listeners after stacks settle
              setTimeout(() => {
                covidState.value = 'idle';
                attachCovidOpen(covidCard);
              }, SHIFT_DURATION_MS);
            });
          }
      );
    });
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
        card.style.transform = 'none';
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

/**
 * Quote popup positioning
 * Flips quote bubble direction when the card is on the right edge.
 */
function quotePopupAdjust(placements: Placement[], numCols: number) {
  for(const p of placements) {
    if(p.el.dataset.isQuote === '1') {
      const icon = p.el.querySelector<HTMLElement>('.quote-icon');
      if(!icon) return;
      const onRight = (p.col + p.colspan - 1) === numCols;
      if(onRight) {
        icon.style.setProperty('--qi-origin', 'bottom right');
        icon.style.setProperty('--qi-tail-angle', '225deg');
        icon.style.setProperty('--qi-left', 'auto');
        icon.style.setProperty('--qi-right', '0');
        icon.style.setProperty('--qi-border-radius', '15px 15px 0 15px');
      } else {
        icon.style.setProperty('--qi-origin', 'bottom left');
        icon.style.setProperty('--qi-tail-angle', '135deg');
        icon.style.setProperty('--qi-left', '0');
        icon.style.setProperty('--qi-right', '0');
        icon.style.setProperty('--qi-border-radius', '15px 15px 15px 0');
      }
    }
  }
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
  if (store.timelineFilterCategories.length > 0) {
    return postsArray.value.filter((post: Post) => {
      return post.categories.nodes.some((cat: Category) =>
          store.timelineFilterCategories.some(c => c.slug === cat.slug)
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
  document.addEventListener('pointerdown', () => {canPlayQuotes.value = true }, {once: true})

  window.addEventListener('resize', () => requestAnimationFrame(updateColumns));

  const timelineTitle = document.querySelector('.timeline-title');
  if(!timelineTitle) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && timelineTitle)
      { anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 })}
      else observer.unobserve(timelineTitle);
    });
  });

  observer.observe(timelineTitle);
});

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
