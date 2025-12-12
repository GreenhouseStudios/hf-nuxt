<style scoped>
.bento-grid {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-auto-rows: var(--row-h, 75px);
  gap: var(--gap, 25px);
  overflow-y: clip;
}

.bento-grid.computing {
  opacity: 0;
}

.bento-inner {
  height: 100%;
}
.bento-inner > div {
  height: 100%;
}

.bento-card {
  opacity: .01;
  transition: transform 1s, opacity .75s;
}

.bento-card:not(.covid-card) {
  cursor: pointer;
}

.transform {
  transform: translateY(150px);
}

.adjustForCovid {
  --to-move: unset;
  transition: transform .75s ease !important;
  transform: var(--to-move) !important;
}
.major-event-card {
  opacity: .01;
  border-radius: calc(var(--ui-radius) * 4);
  transition: transform 1.25s, opacity .75s;
  transition-delay: .25s;
  position: relative;
}
.major-event-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  transition-delay: .25s;
  transition: width .75s ease-out, transform .75s ease-out;
  background: url("../public/major-event-bg.png") no-repeat center bottom;
  border-radius: calc(var(--ui-radius) * 4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.major-event-inner > div {
  box-shadow: none;
}

.major-event-inner > * {
  text-align: center;
  color: white;
  margin-bottom: 0;
  max-width: 80%;
}
.major-event-transform {
  transform: translateY(150px);
}

.covid-card {
  opacity: .01;
  border-radius: calc(var(--ui-radius) * 4);
  transition: transform 1.25s, opacity .75s;
  transition-delay: .25s;
  position: relative;
}

.covid-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  transition-delay: .25s;
  transition: width .75s ease-out, transform .75s ease-out;
  background: url("../public/major-event-bg.png") no-repeat center bottom;
  border-radius: calc(var(--ui-radius) * 4);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 25px;
  gap: 15px;
}

.covid-post {
  display: flex;
  width: 15%;
  min-height: 100% !important;
  max-height: 100% !important;
  --delay: 0;
  cursor: pointer;
}

.covid-post img {
  width: 100% !important;
}

.covid-post.inactive {
  animation: covid-post-inactive-ani .5s var(--delay) ease forwards;
  opacity: 1;
  transform: translateY(0px);
}

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

.covid-post.active {
  animation: covid-post-active-ani .5s var(--delay) ease forwards;
  opacity: 0;
  transform: translateY(200px);
}

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



</style>
<template>

  <!-- NOTES
  Fix tap support for vids
  Fix quote pause/play desync sometimes
  Add multi-major event support (waiting for answer from HF)
  Set covid modal to disable until initial transition end + cards 2 rows under

  -->

  <div class="mb-36 px-2 py-12 md:px-12 overflow-x-hidden" style="width: 99vw">
    <h1 class="text-blue-950 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black timeline-title dark:text-blue-300">CENTENNIAL TIMELINE</h1>

    <section>
      <Filters />
    </section>
     
    <!-- Card Layout (CSS Grid) -->
    <section class="flex flex-col justify-around">
      <div v-if="timelineItems.length === 0">
        No posts found.
      </div>
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
    opacity: 0
  }"
        >
          <li
              v-for="item in timelineItems"
              :key="item.type === 'post' ? item.post.slug : 'covid-2020'"
              :class="[
                'bento-card',
                { 'major-event-card shadow-md': item.type === 'post' && item.post?.eventOptions?.postType === 'major_event' },
                { 'quote-card': item.type === 'post' && item.post?.eventOptions?.postType === 'quote' },
                { 'covid-card': item.type === 'covid' }
              ]"
              :data-card-size="item.type === 'post'
                ? (item.post?.eventOptions?.cardSize ?? 'default')
                : 'large'"

              :data-is-quote="item.type === 'post' && item.post?.eventOptions?.postType === 'quote' ? '1' : '0'"
              :data-is-major-event="item.type === 'post' && item.post?.eventOptions?.postType === 'major_event' ? '1' : '0'"
              :data-is-covid="item.type === 'covid' ? '1' : '0'"
          >
            <!-- normal posts -->
            <div
                v-if="item.type === 'post'"
                :class="item.post?.eventOptions?.postType === 'major_event' ? 'major-event-inner' : 'bento-inner'"
            >
              <Card
                  :post="item.post"
                  :x-multiplier="1"
                  :y-multiplier="1"
                  mode="fixedHeight"
              />
            </div>

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
              <h2 id="covid-title" class="text-6xl font-bold">COVID-19</h2>

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
 * Get post data
 */
const store = useStore();
const { data: posts } = usePosts();

/**
 * Set col/row/card values
 */
const numCols = ref(5);
let cols = numCols.value;
let rowHeight = 75;
const gap = 25;
let layoutInProgress = false;
let covidCardGrow = false;
const smallCardRange = {
  col: 1,
  row: [3, 6]
}
const randCardRange = {
  col: [1, 2],
  row: [3, 6]
}
const lgCardRange = {
  col: 2,
  row: [3, 5]
}

const gridWrapEl = ref<HTMLElement | null>(null);

const gridEl = ref<HTMLElement | null>(null);
type TimelineItem =
  | { type: 'post'; post: Post }
  | { type: 'covid'; year: number; posts: Post[] }


/**
 * Hard rebuild on numCol change / post watch
 */
const rebuildToken = ref(0);
async function hardRebuild() {
  layoutInProgress = false;
  covidCardGrow = false;

  if(gridWrapEl.value) gridWrapEl.value.style.opacity = '0';

  rebuildToken.value++;
  await nextTick();
  await measureAndPack()

  if(gridWrapEl.value) gridWrapEl.value.style.opacity = '1'
}



/**
 * Build bento grid / measure & update bento cards
 */
let imgChecked = false;
let packCount = 0;
async function measureAndPack(reset = false) {
  if(packCount > 5) {
    packCount = 0;
    await hardRebuild();
  } else {
    packCount++;
  }
  if(layoutInProgress) return;
  layoutInProgress = true;
  await nextTick();

  if (!gridEl.value) return;


  const liElements = Array.from(gridEl.value.querySelectorAll('li'));



  if(numCols.value === 1) {
    liElements.forEach(el => {
      el.style.gridRowEnd = 'span 3';
      el.dataset.rowspan = '3';
      el.style.gridColumn = 'span 1';
      el.dataset.colspan = '1';
    })
    cardAnimation();
    return;
  }
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
  // Sewt covid card if 15+ cards in grid & covid card not made yet
  if(liElements.length >= 15 && !covidCardGrow) {
    const covidLi = liElements.find(el => el.dataset.isCovid === '1') ?? null;
    if(covidLi) {
      covidCardGrow = true;
      if(numCols.value > 2) {
        covidLi.addEventListener('pointerenter', function grow() {
          if(covidState.value !== 'idle') return;
          covidState.value = 'opening';

          covidLi.removeEventListener('pointerenter', grow);
          requestAnimationFrame(() => {
            if(numCols.value <= 3) growCovidCard(covidLi, gridEl.value as HTMLElement);
            else spanCovidCard(covidLi, gridEl.value as HTMLElement)
          });
        })
      }
      setCovidSpan(covidLi, gridEl.value as HTMLElement);
    }

  }

  // Reset cards if reset=true
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
  await nextTick()

  // Ensure colspans are valid/normalized
  liElements.forEach(el => {
    if(el.dataset.isCovid === '1' || el.dataset.isQuote === '1') return;
    let c;
    if(el.dataset.cardSize === 'large') {
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

  liElements.forEach(el => {
    if (el.dataset.isQuote === '1') {
      setQuoteSpan(el as HTMLElement, gridEl.value as HTMLElement);
    }
  });

  // Assign rowspans with slight randomization based on column count
  let totalCells = 0;
  liElements.forEach(el => {
    if(el.dataset.isCovid === '1' || el.dataset.isQuote === '1') return;

    const inner = el.querySelector('.bento-inner');
    if(!inner) return;

    const c = parseInt(el.dataset.colspan || '1', 10);
    let r:number;
    if(el.dataset.cardSize === 'large') {
      r = Math.floor(Math.random() * (lgCardRange.row[1] - lgCardRange.row[0] + 1)) + lgCardRange.row[0];
    } else if(el.dataset.cardSize === 'small') {
      r = Math.floor(Math.random() * (smallCardRange.row[1] - smallCardRange.row[0] + 1)) + smallCardRange.row[0];
    } else {
      r = Math.floor(Math.random() * (randCardRange.row[1] - randCardRange.row[0] + 1)) + randCardRange.row[0];
    }
    el.style.gridRowEnd = `span ${r}`;
    el.dataset.rowspan = `${r}`;

    totalCells += r * c;
  });

  // Fill all 'fill-able' gaps
  await growAcrossTwoEmptyRows(8);
  await growSinglesByOne(8);
  await nextTick();

  // Recount total cells after filling
  totalCells = 0;
  for (const el of liElements) {
    const r = parseInt(el.dataset.rowspan || '1', 10);
    const c = parseInt(el.dataset.colspan || '1', 10);
    totalCells += r * c;
  }

  // Determine bottom cards & normalize rowspans (incomplete)
  let rows = Math.ceil(totalCells / numCols.value);
  let remainder = rows * numCols.value - totalCells;

  if (remainder > 0) {
    const lastBottom = Math.max(...liElements.map(el => el.offsetTop + el.offsetHeight));
    const lastRowEls = liElements
        .filter(el => el.offsetTop + el.offsetHeight >= lastBottom - 1)
        .sort((a, b) => (parseInt(a.dataset.colspan || '1') - parseInt(b.dataset.colspan || '1')));

    for(const el of lastRowEls) {
      if (remainder === 0) break;
      const c = parseInt(el.dataset.colspan || '1', 10);
      const addRows = Math.floor(remainder / c);
      if (addRows > 0) {
        const base = parseInt(el.dataset.rowspan || '0', 10);
        el.style.gridRowEnd = `span ${Math.min(5, base + addRows)}`;
        el.dataset.rowspan = String(Math.min(5, base + addRows));
        remainder -= addRows * c;
      }
    }
  }

  // Lock card inner heights to <li> heights
  Array.from(document.querySelectorAll<HTMLElement>('.bento-inner')).forEach(inner => {
    const div = <HTMLElement>inner.firstElementChild;
    if(div) {
      div.style.height = `${inner.offsetHeight}px`;
      div.style.minHeight=  `${inner.offsetHeight}px`;
    }
  })

  // Measure placements without transforms
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
  const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

  // Check empty gaps & re-try filling / reset if unable to fill all gaps
  try {
    let newPlacements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement));
    let emptyGaps = gapsPerCol(newPlacements, numCols.value);
    if(emptyGaps) {


      await nextFrame();

      await growSinglesByOne(7);
      await growAcrossTwoEmptyRows(7);
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
    if(gridEl.value) gridEl.value.style.opacity = '1';
      liElements.forEach(el => {
        if (el.dataset.isCovid === '1') el.classList.add('major-event-transform');
        else if (!el.dataset.animated) el.classList.add('transform');
      });
      cardAnimation();
    layoutInProgress = false;
    const placements = clearTransforms(gridEl.value as HTMLElement, () => getPlacements(gridEl.value as HTMLElement));
    quotePopupAdjust(placements, numCols.value);

    const quotes = liElements.filter(el => el.dataset.isQuote === '1')

    quotes.forEach(quote => {
      quote.addEventListener('mouseenter', () => {
        quote.style.zIndex = '11';
      });
      quote.addEventListener('mouseleave', () => {
        quote.style.zIndex = '9';
      })


    })
  }


}


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







/**
 * Get bento grid placements
 */
type Placement = {
  el: HTMLElement;
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
};
function getPlacements(grid: HTMLElement): Placement[] {
  // Get grid data / set epsilon to ensure accuracy / get all <li> elements
  const { cols, rect, pitchY, pitchX } = getGridMetrics(grid);
  const EPS = 0.1;
  const items = Array.from(grid.querySelectorAll<HTMLElement>('li'));

  // Get & return bento items col/row/position data
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
 */
function gapsPerCol(placements: Placement[], cols:number) {
  const result: Record<number, Array<{start:number,end:number}>> = {};

  // Get all cards of each column
  for (let c = 1; c <= cols; c++) {
    const intervals = placements
        .filter(p => c >= p.col && c <= p.col + p.colspan - 1)
        .map(p => ({ start: p.row, end: p.row + p.rowspan - 1 }))
        .sort((a, b) => a.start - b.start || a.end - b.end);

    // Merge overlapping intervals to get occupied blocks
    const merged: Array<{start:number,end:number}> = [];
    for (const iv of intervals) {
      if (!merged.length || iv.start > merged[merged.length - 1].end + 1) {
        merged.push({ ...iv });
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end);
      }
    }

    // Check breaks in merged intervals (if interval start larger than previous interval end + 1)
    const gaps: Array<{start:number,end:number}> = [];
    let prevEnd = 0;
    for (const iv of merged) {
      if (iv.start > prevEnd + 1) gaps.push({ start: prevEnd + 1, end: iv.start - 1 });
      prevEnd = iv.end;
    }
    let res;
    let maxRow = 0;
    for (const p of placements) {
      if (c >= p.col && c <= p.col + p.colspan - 1) {
        const endRow = p.row + p.rowspan - 1;
        if (endRow > maxRow) maxRow = endRow;
      }
    }
    res =  maxRow;
    result[c] = gaps;

  }
  // Return true if gaps
  for(let r = 1; r <= cols; r++) {
    const gaps = result[r]
    if(gaps && gaps.length > 0) return true;
  }
  return false;
}


/**
 * Get grid data
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
 */
async function growSinglesByOne(maxRowSpan = 7) {
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

async function growAcrossTwoEmptyRows(maxRowSpan = 7) {
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


function growCovidCard(covidCard: HTMLElement, grid: HTMLElement) {

  const placements = clearTransforms(grid, () =>
      getPlacements(grid)
  );

  const covidPlacement = placements.find(p => p.el === covidCard);
  if(!covidPlacement) {
    covidState.value = 'idle';
    return;
  }

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

  inner.style.transition = 'height .75s ease, transform .75s ease-out';


  const innerPosts: HTMLElement[] = Array.from(
      inner.querySelectorAll('.covid-post')
  );

  // ------------ PHASE 1: banner growth ------------
  function startInnerGrowth() {
    if(!inner || !covidTitle) return;

    covidTitle.style.opacity = '0';

    inner.style.height = `${rowHeight * 8 - gap}px`;

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
    const onLeave = function triggerShrink() {
      if (covidState.value !== 'open') return;

      covidState.value = 'closing';
      covidCard.removeEventListener('pointerleave', onLeave);

      let delay = innerPosts.length * 0.1;
      innerPosts.forEach(covidPost => {
        covidPost.style.setProperty('--delay', `${delay}s`);
        delay -= 0.1;
        covidPost.classList.replace('active', 'inactive');
      });

      shrink();
    };

    covidCard.addEventListener('pointerleave', onLeave);
  }

  function shrink() {
    if(!inner || !covidTitle) return;
    innerPosts[0].addEventListener('animationend', () => {
      requestAnimationFrame(() => {
        inner.style.transitionDelay = '1.25s';
        inner.style.height = '100%';

        inner.style.transition = 'height 1s ease, transform .75s ease'

        innerPosts.forEach(covidPost => {
          covidPost.style.display = 'none';
        });

        covidTitle.style.opacity = '1';

        const liElements = Array.from(
            document.querySelectorAll<HTMLElement>('.bento-card')
        );

        liElements.forEach(el => {
          el.classList.remove('adjustForCovid');
        });


        // Re-arm hover after cards have had time to transition back
        setTimeout(() => {
          covidState.value = 'idle';
          covidCard.addEventListener(
              'pointerenter',
              function grow() {
                if (covidState.value !== 'idle') return;
                covidState.value = 'opening';
                requestAnimationFrame(() =>
                    growCovidCard(covidCard, grid)
                );
              },
              { once: true }
          );
        }, 500);

      })
    }, {once:true})

  }
}


/**
 * Calculate cards in covid rows / move cards out of way / grow covid card
 */

const covidState = ref<'idle' | 'opening' | 'open' | 'closing'>('idle');

function spanCovidCard(covidCard: HTMLElement, grid: HTMLElement) {
  const { pitchY } = getGridMetrics(grid);
  const placements = clearTransforms(grid, () =>
      getPlacements(grid)
  );

  const covidPlacement = placements.find(p => p.el === covidCard);
  if (!covidPlacement) {
    covidState.value = 'idle';
    return;
  }

  const covidTop = covidPlacement.row;
  const covidBot = covidPlacement.row + covidPlacement.rowspan - 1;
  const covidMid = covidTop + Math.floor(covidPlacement.rowspan / 2);

  const cTopPx = covidTop * pitchY;
  const cBotPx = (covidPlacement.row + covidPlacement.rowspan) * pitchY;

  // maps for stack shifts
  const upByCol = new Map<number, number>();
  const downByCol = new Map<number, number>();

  // per-card shift (only for cards overlapping COVID rows)
  const perCardShift = new Map<HTMLElement, number>();

  // ---------- PASS 1: collect overlaps & per-card shifts ----------
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
      // inside COVID rows
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
      // candidates for stacks above/below
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

  // ---------- PASS 2: apply shifts ----------
  let anyShift = false;

  for (const p of placements) {
    if (p.el === covidCard) continue;

    let deltaY = perCardShift.get(p.el) ?? 0;

    if (deltaY === 0) {
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

      if (upPx > 0 && downPx === 0) {
        deltaY = -upPx;
      } else if (downPx > 0 && upPx === 0) {
        deltaY = downPx;
      } else if (upPx > 0 && downPx > 0) {
        deltaY = downPx >= upPx ? downPx : -upPx;
      }
    }

    if (deltaY !== 0) anyShift = true;

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

  const gridRect = grid.getBoundingClientRect();
  const innerRect = inner.getBoundingClientRect();
  const distFromLeft = innerRect.left - gridRect.left;
  const fullWidth = gridRect.width;

  inner.style.transition =
      prevTransition || 'width .75s ease-out, transform .75s ease-out';


  const innerPosts: HTMLElement[] = Array.from(
      inner.querySelectorAll('.covid-post')
  );

  // ------------ PHASE 2: banner expansion ------------
  function startInnerExpansion() {
    if(!inner || !covidTitle) return;

    covidTitle.style.opacity = '0';
    inner.style.transitionDelay = '0s';

    inner.style.transform = `translateX(${-distFromLeft}px)`;
    inner.style.width = `${fullWidth}px`;

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



  // Wait approximately for per-card shift
  const SHIFT_DURATION_MS = 750;
  if (anyShift) {
    setTimeout(startInnerExpansion, SHIFT_DURATION_MS);
  } else {
    startInnerExpansion();
  }


  // ----------------- pointerleave + shrink -----------------
  function armPointerLeave() {
    const onLeave = function triggerShrink() {
      if (covidState.value !== 'open') return;

      covidState.value = 'closing';
      covidCard.removeEventListener('pointerleave', onLeave);

      let delay = 0;
      innerPosts.forEach(covidPost => {
        covidPost.style.setProperty('--delay', `${delay}s`);
        delay += 0.1;
        covidPost.classList.replace('active', 'inactive');
      });

      shrink();
    };

    covidCard.addEventListener('pointerleave', onLeave);
  }

  function shrink() {
    if(!inner || !covidTitle) return;
    requestAnimationFrame(() => {
      inner.style.transitionDelay = '.5s';
      inner.style.width = '100%';
      inner.style.transform = 'none';

      inner.addEventListener(
          'transitionend',
          function shrunk(e) {
            if (e.propertyName !== 'width') return;
            inner.removeEventListener('transitionend', shrunk);
            inner.style.transitionDelay = 'unset';

            innerPosts.forEach(covidPost => {
              covidPost.style.display = 'none';
            });

            requestAnimationFrame(() => {
              covidTitle.style.opacity = '1';

              const liElements = Array.from(
                  document.querySelectorAll<HTMLElement>('.bento-card')
              );

              liElements.forEach(el => {
                el.classList.remove('adjustForCovid');
              });

              // Re-arm hover after cards have had time to transition back
              setTimeout(() => {
                covidState.value = 'idle';
                covidCard.addEventListener(
                    'pointerenter',
                    function grow() {
                      if (covidState.value !== 'idle') return;
                      covidState.value = 'opening';
                      requestAnimationFrame(() =>
                          spanCovidCard(covidCard, grid)
                      );
                    },
                    { once: true }
                );
              }, SHIFT_DURATION_MS);
            });
          }
      );
    });
  }
}


/**
 * Calculate translate for cards in covid row
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

  cards.forEach(card => {
    if(card.dataset.animated === 'true') return;
    card.style.opacity = '0';
    observer.observe(card);
  })
}

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
 */
function updateColumns() {
  const width = window.innerWidth;

  if (width >= 1536) numCols.value = 5
  else if (width >= 1280) numCols.value = 4
  else if (width >= 1024) numCols.value = 3
  else if (width >= 640) numCols.value = 2
  else numCols.value = 1;
  if(cols !== numCols.value) {
    cols = numCols.value;
    hardRebuild();
  }
}

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

const filteredPostsBase = computed<Post[]>(() => {
  const base = postsFilteredByCategory.value;
  const term = store.searchTerm.trim().toLowerCase();
  if(!term) return base;

  return base.filter((post: Post) =>
    post.title.toLowerCase().includes(term)
  );
})


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




function spaceQuotes(base: Post[]): Post[] {
  if (!base.length) return [];

  const quotePosts = base.filter(p => p.eventOptions?.postType === 'quote');
  const defaultPosts = base.filter(p => p.eventOptions?.postType !== 'quote');

  if (quotePosts.length === 0) return defaultPosts;

  const quoteCount = quotePosts.length;
  const raw = base.length / quoteCount;
  const interval = Math.max(1, Math.round(raw));

  const result: Post[] = [];
  let quoteIndex = 0;
  let nonIndex = 0;
  let sinceLastQuote = 0;

  const firstQuoteOffset = 1; // “a couple in”
  let firstQuotePlaced = false;

  while (nonIndex < defaultPosts.length) {
    result.push(defaultPosts[nonIndex++]);
    sinceLastQuote++;

    if (!firstQuotePlaced &&
        sinceLastQuote >= firstQuoteOffset &&
        quoteIndex < quotePosts.length) {
      // place the very first quote a bit earlier
      result.push(quotePosts[quoteIndex++]);
      firstQuotePlaced = true;
      sinceLastQuote = 0;
    } else if (
        firstQuotePlaced &&
        sinceLastQuote >= interval &&
        quoteIndex < quotePosts.length
    ) {
      // then use the normal interval
      result.push(quotePosts[quoteIndex++]);
      sinceLastQuote = 0;
    }
  }

  // any leftover quotes just append at the end
  while (quoteIndex < quotePosts.length) {
    result.push(quotePosts[quoteIndex++]);
  }

  return result;
}


const shouldMakeCovid = computed(() => {
  return !!filteredPostsBase.value
      .filter(post => post.eventOptions?.postType === 'covid_post')
      .length;
})

const covidPosts = computed(() => {
  return filteredPostsBase.value.filter(
      post => post.eventOptions?.postType === 'covid_post'
  );
})

const COVID_YEAR = 2020;

const timelineItems = computed<TimelineItem[]>(() => {
  // start from filteredPostsBase, but ignore covid here
  const nonCovid = filteredPostsBase.value.filter(
      p => p.eventOptions?.postType !== 'covid_post'
  );
  const covid = covidPosts.value;
  const hasCovid = covid.length > 0;

  if (!nonCovid.length && !hasCovid) return [];

  const aboveBase: Post[] = [];
  const equalBase: Post[] = [];
  const belowBase: Post[] = [];

  for (const post of nonCovid) {
    const year = parseInt(post.eventOptions?.eventYear || '0', 10);
    if (year > COVID_YEAR) aboveBase.push(post);
    else if (year === COVID_YEAR) equalBase.push(post);
    else belowBase.push(post);
  }

  // apply spacing inside each bucket
  const aboveSpaced = spaceQuotes(aboveBase);
  const equalSpaced = spaceQuotes(equalBase);
  const belowSpaced = spaceQuotes(belowBase);

  const result: TimelineItem[] = [];

  for (const post of aboveSpaced) {
    result.push({ type: 'post', post });
  }

  for (const post of equalSpaced) {
    result.push({ type: 'post', post });
  }

  if (hasCovid) {
    result.push({
      type: 'covid',
      year: COVID_YEAR,
      posts: covid,
    });
  }

  for (const post of belowSpaced) {
    result.push({ type: 'post', post });
  }

  return result;
});

const filteredPosts = computed(() => {
  return postsFilteredByCategory.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : postsFilteredByCategory.value;
  });
});



console.log(timelineItems)


onMounted( async () => {
  await nextTick();
  updateColumns();
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
