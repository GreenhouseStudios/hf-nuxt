<style scoped>
.bento-grid {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-auto-rows: var(--row-h, 75px);
  gap: var(--gap, 25px);
  overflow-y: clip;
  padding-bottom: 30px;
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
.bento-inner img {
  max-height: 65%;
  min-height: 50%;
}
.bento-card {
  opacity: .01;
  transition: transform 1s, opacity .75s;
}
.transform {
  transform: translateY(150px);
}

.adjustForMajorEvent {
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
  z-index: 97;
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

</style>
<style>



</style>
<template>

  <!-- NOTES
  Change grid calls to use ref
  Fix mount/update bug when navigating between pages with component
  Fix tap support for vids
  Fix quote pause/play desync sometimes
  Fix <p> in major event span
  Design modals following Yuna's design
  Add multi-major event support (waiting for answer from HF)

  -->

  <div class="max-w-screen mb-36 px-2 py-12 md:px-12 overflow-x-hidden">
    <h1 class="text-blue-950 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black timeline-title dark:text-blue-300">CENTENNIAL TIMELINE</h1>
    <section>
      <Filters />
    </section>
     
    <!-- Card Layout (CSS Grid) -->
    <section class="flex flex-col justify-around">
      <div v-if="filteredPosts.length === 0">
        No posts found.
      </div>
      <div v-else>
        <ul
            :key="`grid-${rebuildToken}-${numCols}`"
            ref="gridEl"
            id="card-grid"
            class="bento-grid"
            :style="{
    '--cols': numCols,
    '--row-h': rowHeight + 'px',
    '--gap': gap + 'px',
    opacity: 0
  }"
        >
          <li
              v-for="(post, i) in filteredPosts"
              :key="post?.id"
              :id="post?.eventOptions?.postType === 'major_event' ? 'major-event-li' : post?.id"
              :class="['bento-card', { 'major-event-card shadow-md': post?.eventOptions?.postType === 'major_event' }, { 'quote-card': post?.eventOptions?.postType === 'quote' }]"
              :data-card-size="post?.eventOptions?.cardSize"
              :data-is-quote="post?.eventOptions?.postType === 'quote' ? '1' : '0'"
              :data-is-major-event="post?.eventOptions?.postType === 'major_event' ? '1' : '0'"

          >
            <div
            :class="post?.eventOptions?.postType === 'major_event' ? 'major-event-inner' : 'bento-inner'"
            >
              <Card
                  :post="post"
                  :x-multiplier="1"
                  :y-multiplier="1"
                  mode="fixedHeight"
              />
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import 'gridstack/dist/gridstack.min.css';
import { useStore } from '~/stores/store';
import Card from "~/components/card.vue";
import Filters from "~/components/filters.vue";


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
let majorEventCardGrow = false;
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
  row: [3, 6]
}

const gridEl = ref<HTMLElement | null>(null);

/**
 * Hard rebuild on numCol change / post watch
 */
const rebuildToken = ref(0);
async function hardRebuild() {
  layoutInProgress = false;
  majorEventCardGrow = false;
  rebuildToken.value++;
  if(gridEl.value) gridEl.value.style.opacity = '0';
  await nextTick();
  await measureAndPack()
}

/**
 * Build bento grid / measure & update bento cards
 */
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

  const grid = document.querySelector('.bento-grid') ;
  if (!grid) {
    return;
  }


  const liElements = Array.from(grid.querySelectorAll('li'));

  let postsFiltered = false;
  if(filteredPosts.value.length < postsArray.value.length) {
    postsFiltered = true;
  }

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
  // Make majorEvent card if 15+ cards in grid & majorEvent card not made yet
  if(liElements.length >= 15 && !majorEventCardGrow && !postsFiltered) {
    const majorEventLi = liElements.find(el => el.dataset.isMajorEvent === '1') ?? null;
    if(!majorEventLi) return;
    majorEventCardGrow = true;

    if(numCols.value > 2) {
      majorEventLi.addEventListener('pointerenter', function grow() {
        majorEventLi.removeEventListener('pointerenter', grow);
        requestAnimationFrame(() => growMajorEventCard(majorEventLi, grid as HTMLElement));
      })
    }
    setMajorEventSpan(majorEventLi, grid as HTMLElement);
  }

  // Reset cards if reset=true
  if(reset) {
    liElements.forEach(el => {
      if(el.dataset.isMajorEvent === '1') { setMajorEventSpan(el as HTMLElement, grid as HTMLElement) }
      else if(el.dataset.isQuote === '1') { setQuoteSpan(el as HTMLElement, grid as HTMLElement) }
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
    if(el.dataset.isMajorEvent === '1' || el.dataset.isQuote === '1') return;
    let c;
    if(el.dataset.cardSize === 'large') {
      c = lgCardRange.col;
    } else if(el.dataset.cardSize === 'small') {
      c = smallCardRange.col;
    } else {
      c = Math.random() > .25 ? randCardRange.col[0] : randCardRange.col[1];
    }
    el.style.gridColumn = `span ${c}`;
    el.dataset.colspan = `${c}`;
  })

  liElements.forEach(el => {
    if (el.dataset.isQuote === '1') {
      setQuoteSpan(el as HTMLElement, grid as HTMLElement);
    }
  });

  // Assign rowspans with slight randomization based on column count
  let totalCells = 0;
  liElements.forEach(el => {
    if(el.dataset.isMajorEvent === '1' || el.dataset.isQuote === '1') return;

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
  const placements = clearTransforms(grid as HTMLElement, () => getPlacements(grid as HTMLElement))
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
  // Check empty gaps & re-try filling / reset if unable to fill all gaps
  try {
    let newPlacements = clearTransforms(grid as HTMLElement, () => getPlacements(grid as HTMLElement));
    let emptyGaps = gapsPerCol(newPlacements, numCols.value);
    if(emptyGaps) { requestAnimationFrame(async () => {
      await growSinglesByOne(7);
      await growAcrossTwoEmptyRows(7);
      await nextTick();
      newPlacements = clearTransforms(grid as HTMLElement, () => getPlacements(grid as HTMLElement));
      await nextTick();
      const newEmpty = gapsPerCol(newPlacements, numCols.value);
      if(newEmpty) {
        await measureAndPack(true)
      }
    });
  }

    // Add animations after computed grid placements valid
  } finally {
    if(gridEl.value) gridEl.value.style.opacity = '1';
      liElements.forEach(el => {
        if (el.dataset.isMajorEvent === '1') el.classList.add('major-event-transform');
        else if (!el.dataset.animated) el.classList.add('transform');
      });
      cardAnimation();
    layoutInProgress = false;
    const placements = clearTransforms(grid as HTMLElement, () => getPlacements(grid as HTMLElement));
    quotePopupAdjust(placements, numCols.value);

    const quotes = liElements.filter(el => el.dataset.isQuote === '1')

    quotes.forEach(quote => {
      quote.addEventListener('mouseenter', () => {
        quote.style.zIndex = '99';
      });
      quote.addEventListener('mouseleave', () => {
        quote.style.zIndex = '95';
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
  const grid = document.getElementById('card-grid') as HTMLElement | null;
  if (!grid) return;
  const placements = clearTransforms(grid, () => getPlacements(grid));

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
  const grid = document.getElementById('card-grid') as HTMLElement | null;
  if (!grid) return;
  const placements = clearTransforms(grid, () => getPlacements(grid));

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
  Array.from(grid.querySelectorAll('li')).forEach(el => {
    const rows = parseInt(el.dataset.rowspan || '1');

    if(rows > 6) {
      const img = el.querySelector('img');
      if(!img) return;
      img.style.height = '50%';
    }
  })
}


/**
 * Set majorEvent span/columns depending on column count
 */
function setMajorEventSpan(card: HTMLElement, grid: HTMLElement) {
  if(!card || !grid) return;
  let colWidth = Math.floor(
      (grid.getBoundingClientRect().width / numCols.value - ((numCols.value - 1) * 25))) + 25;
  let majorEventRows = Math.floor((colWidth * 1.5) / rowHeight);

  if(numCols.value > 1) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = `span ${majorEventRows}`;
    card.dataset.rowspan = `${majorEventRows}`;
  } else if(numCols.value === 2) {
    card.style.gridColumn = 'span 2';
    card.dataset.colspan = '2';
    card.style.gridRowEnd = 'span 2';
    card.dataset.rowspan = '2';
  } else {
    card.style.gridColumn = 'span 1';
    card.dataset.colspan = '1';
    majorEventRows = Math.floor(grid.getBoundingClientRect().width / rowHeight);
    card.style.gridRowEnd = `span ${majorEventRows}`;
    card.dataset.rowspan = `${majorEventRows}`;
  }
}


/**
 * Calculate cards in majorEvent rows / move cards out of way / grow majorEvent card
 */
function growMajorEventCard(majorEventCard: HTMLElement, grid: HTMLElement) {
  const { pitchY } = getGridMetrics(grid);
  const placements = clearTransforms(grid as HTMLElement, () => getPlacements(grid as HTMLElement));
  const majorEventPlacement = placements.find(p => p.el === majorEventCard);
  if (!majorEventPlacement) return;

  const majorEventTop = majorEventPlacement.row;
  const majorEventBot = majorEventPlacement.row + majorEventPlacement.rowspan - 1;
  const majorEventMid = majorEventTop + Math.floor(majorEventPlacement.rowspan / 2);

  const cTopPx = majorEventTop * pitchY;
  const cBotPx = (majorEventPlacement.row + majorEventPlacement.rowspan) * pitchY;

  // maps for stack shifts
  const upByCol = new Map<number, number>();
  const downByCol = new Map<number, number>();

  // per-card shift (only for cards overlapping COVID rows)
  const perCardShift = new Map<HTMLElement, number>();

  // pass 1: collect overlaps and max shifts
  for (const p of placements) {
    if (p.el === majorEventCard) continue;

    const pTop = p.row;
    const pBot = p.row + p.rowspan - 1;

    const overlapRows = Math.max(0, Math.min(pBot, majorEventBot) - Math.max(pTop, majorEventTop) + 1);
    const overlapPx = overlapRows * pitchY;

    const colStart = p.col;
    const colEnd = p.col + p.colspan - 1;

    if (overlapRows > 0) {
      // inside COVID rows
      const center = pTop + (p.rowspan - 1) / 2;
      const delta = center < majorEventMid ? -overlapPx : overlapPx;
      perCardShift.set(p.el, delta);

      // record per-column max for stacks
      for (let c = colStart; c <= colEnd; c++) {
        if (delta < 0) {
          upByCol.set(c, Math.max(upByCol.get(c) ?? 0, overlapPx));
        } else {
          downByCol.set(c, Math.max(downByCol.get(c) ?? 0, overlapPx));
        }
      }
    } else {
      // no overlap — candidate for stacks
      if (pBot < majorEventTop) {
        for (let c = colStart; c <= colEnd; c++) {
          upByCol.set(c, Math.max(upByCol.get(c) ?? 0, 0));
        }
      } else if (pTop > majorEventBot) {
        for (let c = colStart; c <= colEnd; c++) {
          downByCol.set(c, Math.max(downByCol.get(c) ?? 0, 0));
        }
      }
    }
  }

  // pass 2: apply shifts
  for (const p of placements) {
    if (p.el === majorEventCard) continue;

    let deltaY = perCardShift.get(p.el) ?? 0;

    if (deltaY === 0) {
      // check stacks for non-overlapping cards
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
        // pick the stronger one (just in case)
        deltaY = (downPx >= upPx) ? downPx : -upPx;
      }
    }


    p.el.style.setProperty('--to-move', mergeTranslateY(p.el.style.transform || "", deltaY));
    p.el.classList.add('adjustForMajorEvent');
  }
  const inner = <HTMLElement>majorEventCard.querySelector('.major-event-inner');
  const innerRect = inner?.getBoundingClientRect() || null;
  if(!inner || !innerRect) return;

  const textGrow = <HTMLElement>inner.querySelector('#text-grow');
  const titleShrunk = <HTMLElement>inner.querySelector('#title-shrunk');

  if(!textGrow || !titleShrunk) return;
  titleShrunk.style.opacity = '0';
  titleShrunk.addEventListener('transitionend', function spanInner() {
    titleShrunk.removeEventListener('transitionend', spanInner);
    const gridRect = grid.getBoundingClientRect();
    const distFromLeft = innerRect.left - gridRect.left;

    let maxShiftEl: HTMLElement | null = null;
    let maxAbs = -Infinity;
    for (const [el, val] of perCardShift.entries()) {
      const abs = Math.abs(val);
      if (abs > maxAbs) {
        maxAbs = abs;
        maxShiftEl = el;
      }
    }

    if(maxShiftEl) {
      maxShiftEl.addEventListener('transitionend', () => {
        inner.style.transform = `translateX(${-distFromLeft}px)`;
        inner.style.width = `${gridRect.width}px`;
      }, {once:true})
    } else {
      let firstShiftEl: HTMLElement | null;
      firstShiftEl = perCardShift.keys().next().value ?? null;
      if(firstShiftEl)
        firstShiftEl.addEventListener('transitionend', () => {
          setTimeout(() => {
            inner.style.transform = `translateX(${-distFromLeft}px)`;
            inner.style.width = `${gridRect.width}px`;
          }, 300);

        })
    }




    inner.addEventListener('pointerleave', function shrink() {
      inner.removeEventListener('pointerleave', shrink);
      requestAnimationFrame(() => {
        inner.style.width = '100%';
        inner.style.transform = 'none';

        textGrow.style.opacity = '0';

        inner.addEventListener('transitionend', function shrunk(e) {
          if(e.propertyName !== 'width') return;
          inner.removeEventListener('transitionend', shrunk);
          requestAnimationFrame(() => {
            textGrow.style.display = 'none';

            titleShrunk.style.display = '';
            void titleShrunk.offsetWidth;
            titleShrunk.style.opacity = '1';
            const liElements = Array.from(document.querySelectorAll('.bento-card'));
            let reset = false;

            let maxShiftEl: HTMLElement | null = null;
            let maxAbs = -Infinity;
            for (const [el, val] of perCardShift.entries()) {
              const abs = Math.abs(val);
              if (abs > maxAbs) {
                maxAbs = abs;
                maxShiftEl = el;
              }
            }

            if(maxShiftEl) {
              maxShiftEl.addEventListener('transitionend', () => {
                inner.addEventListener('pointerenter', function grow() {
                  requestAnimationFrame(() => growMajorEventCard(majorEventCard, grid))
                }, {once:true})

              }, {once:true})
            } else {
              let firstShiftEl: HTMLElement | null = null;
              firstShiftEl = perCardShift.keys().next().value ?? null;
              if(firstShiftEl)
                firstShiftEl.addEventListener('transitionend', () => {
                setTimeout(() => {
                  majorEventCard.addEventListener('pointerenter', function grow() {
                    requestAnimationFrame(() => growMajorEventCard(majorEventCard, grid))
                  }, {once:true})
                }, 300);

              })
            }

            liElements.forEach(el => {
              if(el.classList.contains('adjustForMajorEvent')) {
                el.classList.remove('adjustForMajorEvent');
              }
            });
          })

        })


      })
    });

  })





  titleShrunk.style.opacity = '0';
  inner.addEventListener('transitionend', function grow(e) {
    if(e.propertyName !== 'width') return;
    inner.removeEventListener('transitionend', grow);
    titleShrunk.style.display = 'none';
    textGrow.style.display = '';
    void textGrow.offsetWidth;
    textGrow.style.opacity = '1';
  });
}


/**
 * Calculate translate for cards in majorEvent row
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
console.log(postsArray)
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

const filteredPosts = computed(() => {
  return postsFilteredByCategory.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : postsFilteredByCategory.value;
  });
});



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
watch([filteredPosts], async () => {
  await nextTick();
  console.log(filteredPosts)
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
