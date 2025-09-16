<style scoped>
.bento-grid {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(var(--cols, 4), 1fr);
  grid-auto-rows: var(--row-h, 75px);
  gap: var(--gap, 25px);
}
.bento-inner {
  height: 100%;
}
.bento-inner > div {
  height: 100%;
}
.bento-inner img {
  max-height: 65%;
}
.bento-card {
  opacity: 0;
  transition: transform 1.25s, opacity .75s;
  transition-delay: .25s;
}
.transform {
  transform: translateY(150px);
}



</style>
<template>


  <div class="max-w-screen mb-36 px-2 py-12 md:px-12 overflow-x-hidden">
    <h1 class="text-blue-950 text-5xl md:text-9xl font-black timeline-title dark:text-blue-300">OUR TIMELINE</h1>
    <section>
      <Filters />
    </section>
     
    <!-- Card Layout (CSS Grid) -->
    <section class="flex justify-around">
      <div v-if="filteredPosts.length === 0">
        No posts found.
      </div>
      <div v-else>
        <ul
            ref="gridEl"
            id="card-grid"
            class="bento-grid"
            :style="{
    '--cols': numCols,
    '--row-h': rowHeight + 'px',
    '--gap': gap + 'px'
  }"
        >
          <li
              v-for="(post, i) in filteredPosts"
              :key="i"
              :id="post.id"
              class="bento-card"

          >
            <div class="bento-inner">
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

    <!-- <section class="my-5 md:px-18 px-2">
      <div class="grid md:grid-cols-2 grid-cols-1 mx-auto gap-8">
        <decade-card v-for="i in 4" />
      </div>
    </section> -->

  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
import AOS from 'aos';
import type { DropdownMenuItem } from '@nuxt/ui/dist/module'
import { nextTick, onMounted, onUnmounted, toRaw, ref, useTemplateRef, watch, computed, onBeforeUnmount } from 'vue';
import { chunk } from 'es-toolkit';
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { useStore } from '~/stores/store';
import {resolveObjMapThunk} from "graphql/type";

const gridContainer = useTemplateRef('gridContainer');
const store = useStore();
const { data: posts } = usePosts();
const layoutModes = ref<DropdownMenuItem[]>([
  { label: 'Flex', icon: 'i-lucide-user'},
  { label: 'Grid', icon: 'i-lucide-user' },
]);
const selectedLayoutMode = ref<DropdownMenuItem>(layoutModes.value[0]);
const numCols = ref(5);
let cols = numCols.value;
let rowHeight = 75;

const gridRef = ref<HTMLElement | null>(null);
let ro: ResizeObserver | null = null;

const gap = 25;


async function measureAndPack(reset = false) {
  await nextTick();

  const grid = document.querySelector('.bento-grid') ;
  if (!grid) return;

  const rowH = parseFloat(getComputedStyle(grid).getPropertyValue('--row'));
  const cols = parseFloat(getComputedStyle(grid).getPropertyValue('--cols'));

  const liElements = Array.from(grid.querySelectorAll('li:not(.filler)'));
  const styles = getComputedStyle(grid);

  const gapPx = styles.gap || gap;

  if(reset) {
    liElements.forEach(el => {
      el.style.gridColumn = 'span 1';
      el.dataset.colspan = 1;
      el.style.gridRowEnd = 'span 1';
      el.dataset.rowspan = 1;
    })
  }

  liElements.forEach(el => {
    const c = parseInt(el.dataset.colspan || '1', 10);
    el.style.gridColumn = `span ${Math.max(1, Math.min(cols, c))}`;
    el.dataset.colspan = c;
  })
  let totalCells = 0;
  liElements.forEach(el => {
    const inner = el.querySelector('.bento-inner');
    if(!inner) return;
    const c = parseInt(el.dataset.colspan || '1', 10);
    const height = inner.getBoundingClientRect().height;

    const r = Math.floor(Math.random() * (6 - 3) + 3);
    el.style.gridRowEnd = `span ${r}`;
    el.dataset.rowspan = `${r}`;
    if(el.dataset.rowspan - 1 <= 2) {
      if(Math.random() <= .55) {
        el.style.gridColumn = `span ${c + 1}`;
        el.dataset.colspan = `${c + 1}`
      }
    } else {
      if(Math.random() <= .1) {
        el.style.gridColumn = `span ${c + 1}`
        el.dataset.colspan = `${c + 1}`
      }
    }

    totalCells += r * c;


  });

  await growAcrossTwoEmptyRows(7);
  await growSinglesByOne(7);

  totalCells = 0;
  for (const el of liElements) {
    const r = parseInt(el.dataset.rowspan || '1', 10);
    const c = parseInt(el.dataset.colspan || '1', 10);
    totalCells += r * c;
  }

  Array.from(grid.querySelectorAll('.filler')).forEach(f => f.remove());

  let rows = Math.ceil(totalCells / cols);
  let remainder = rows * cols - totalCells;

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
        el.style.gridRowEnd = `span ${base + addRows}`;
        el.dataset.rowspan = base + addRows;
        remainder -= addRows * c;
      }
    }
/*    if (remainder > 0) {
      const filler = document.createElement('li');
      filler.className = '.filler';
      filler.style.visibility = 'hidden';
      filler.style.pointerEvents = 'none';
      filler.style.gridColumn = `span ${Math.min(remainder, cols)}`;
      filler.style.gridRowEnd = 'span 1';
      grid.appendChild(filler)
    }*/
  }
  Array.from(document.querySelectorAll('.bento-inner')).forEach(inner => {
    const div = inner.firstElementChild;
    if(div) {
      div.style.height = `${inner.offsetHeight}px`;
      div.style.minHeight=  `${inner.offsetHeight}px`;
    }
  })

  await nextTick();
  const placements = getPlacements(grid as HTMLElement);
  const bottom = getBottomRow(grid as HTMLElement);
  const r = [];
  for(let c = 1; c <= 5; c++) {
    let rowCount = 0;
    let prevRow = 0;
    placements.forEach(p => {
      if(prevRow === 0) prevRow = p.row + p.rowspan;
      let emptyRows = [];
      if(p.col === c || (p.colspan > 1 && (p.col === c + 1 || p.col === c - 1))) {
        rowCount += p.rowspan;
        prevRow = p.row + p.rowspan
      }


    })

  }

    /*if(p.row + p.rowspan >= -1) return;
    console.log(p.row)


    const aboveEmptyGlobal = isVisualRowEmpty(grid as HTMLElement, 3);
    const aboveEmptyLocal  = isRowAboveEmptyForCard(p.el as HTMLElement, grid as HTMLElement);
    const belowEmptyLocal  = isRowBelowEmptyForCard(p.el as HTMLElement, grid as HTMLElement);
    let log = '';
    if(aboveEmptyGlobal) log += `above empty global ${aboveEmptyGlobal}`;
    if(aboveEmptyLocal) log += `above empty local ${aboveEmptyLocal}`;
    if(belowEmptyLocal) log += `below empty local ${belowEmptyLocal}`;
    if(log !== '') {
      console.log(p.el)
      console.log(log)
    }
  })*/
/*  console.log('bottom ' + bottom)
  const { gaps } = gapsPerCol(placements, numCols.value);
  gaps;*/


  const empty = gapsPerCol(placements, numCols.value);
  console.log(empty)
  if(empty) { await measureAndPack(true) }
  liElements.forEach(el => {
    el.classList.add('transform')
  })
  cardAnimation();
/*  liElements.forEach(el => {
    el.firstElementChild.setAttribute('data-aos', 'fade-up');
    el.firstElementChild.setAttribute('data-aos-once', 'true')
  })*/
}

function checkEmptyRows(placements: Placement[], c:number): boolean {
  const result = gapsPerCol(placements, c);

  let empty = false;
  for(let r in result) {
    if(r.length > 0) {
      empty = true;
    }
  }
  return empty;
}

function gapsPerCol(placements: Placement[], cols:number) {

  const bottomRow = placements.reduce((m, p) => {
    const end = p.row + p.rowspan - 1;
    return Math.max(m, end)
  }, 0)

  const result: Record<number, Array<{start:number,end:number}>> = {};
  const bottoms = [];
  for (let c = 1; c <= cols; c++) {
    const intervals = placements
        .filter(p => c >= p.col && c <= p.col + p.colspan - 1)
        .map(p => ({ start: p.row, end: p.row + p.rowspan - 1 }))
        .sort((a, b) => a.start - b.start || a.end - b.end);

    const merged: Array<{start:number,end:number}> = [];
    for (const iv of intervals) {
      if (!merged.length || iv.start > merged[merged.length - 1].end + 1) {
        merged.push({ ...iv });
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, iv.end);
      }
    }

    // gaps are the spaces between merged intervals, plus top/bottom edges
    const gaps: Array<{start:number,end:number}> = [];
    let prevEnd = 0; // row 0 (imaginary) so we detect a gap from row 1
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

    for (const p of placements) {
      if(p.col === c) {
        bottoms.push(placements.find(p => res === p.row + p.rowspan - 1));
        break;
      }
    }
    result[c] = gaps;

  }
  let empty = false;
  for(let r = 1; r <= numCols.value; r++) {
    if(result[r].length > 0) {
      empty = true;
      break;
    }
  }
  return empty;
}

function getBottomRow(grid: HTMLElement) {
  const placements = getPlacements(grid);
  let maxEnd = 0;
  placements.forEach(p => {
    const end = p.row + p.rowspan - 1;
    if(end > maxEnd) maxEnd = end;
  })
  return maxEnd;
}

function isOnBottomRow(el: HTMLElement, grid: HTMLElement) {
  const placements = getPlacements(grid);
  const me = placements.find(p => p.el === el);

  if (!me) return false;
  const bottomRow = getBottomRow(grid);
  const myEnd = me.row + me.rowspan - 1;
  return myEnd <= bottomRow - 2;
}

type Placement = {
  el: HTMLElement;
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
};

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

function getPlacements(grid: HTMLElement): Placement[] {
  const { cols, rect, pitchY, pitchX } = getGridMetrics(grid);
  const EPS = 0.1;
  const items = Array.from(grid.querySelectorAll<HTMLElement>('li:not(.filler)'));

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

async function growAcrossTwoEmptyRows(maxRowSpan = 7) {
  await nextTick();
  const grid = document.getElementById('card-grid') as HTMLElement | null;
  if (!grid) return;

  const placements = getPlacements(grid);

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

function cardAnimation() {
  const cards = document.querySelectorAll<HTMLElement>('.bento-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.transform = 'none';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target)
      }
    })
  }, {threshold: .2});

  cards.forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  })
}


function isVisualRowEmpty(grid: HTMLElement, rowIndex: number) {
  const placements = getPlacements(grid);
  return !placements.some(p => {
    const start = p.row;
    const end   = p.row + p.rowspan - 1;
    return rowIndex >= start && rowIndex <= end;
  });
}

async function growSinglesByOne(maxRowSpan = 7) {
  await nextTick();
  const grid = document.getElementById('card-grid') as HTMLElement | null;
  if (!grid) return;

  const placements = getPlacements(grid);

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

function isAdjacentRowEmptyForCard(cardEl: HTMLElement, grid: HTMLElement, direction: -1 | 1) {
  const placements = getPlacements(grid);
  const me = placements.find(p => p.el === cardEl);
  if (!me) return false;

  const targetRow = direction === -1 ? me.row - 1 : me.row + me.rowspan;
  if (targetRow < 1) return false;

  const left  = me.col;
  const right = me.col + me.colspan - 1;

  const occupied = placements.some(p => {
    if (p.el === cardEl) return false;
    const pStart = p.row, pEnd = p.row + p.rowspan - 1;
    if (targetRow < pStart || targetRow > pEnd) return false;
    const pLeft = p.col, pRight = p.col + p.colspan - 1;
    return !(pLeft > right || pRight < left);
  });

  return !occupied;
}

const isRowAboveEmptyForCard = (el: HTMLElement, grid: HTMLElement) =>
    isAdjacentRowEmptyForCard(el, grid, -1);

const isRowBelowEmptyForCard = (el: HTMLElement, grid: HTMLElement) =>
    isAdjacentRowEmptyForCard(el, grid, +1);


function updateColumns() {
  const width = window.innerWidth;

  if (width >= 1536) numCols.value = 5
  else if (width >= 1280) numCols.value = 4
  else if (width >= 1024) numCols.value = 3
  else if (width >= 640) numCols.value = 2
  else numCols.value = 1;
  if(cols !== numCols.value) requestAnimationFrame(() => measureAndPack(true))
  cols = numCols.value;
}

const postsArray = computed(() => {
  if (Array.isArray(posts.value)) {
    return posts.value.slice().sort((a: Post, b: Post) => {
      const yearA = a.cardOptions?.year || 0;
      const yearB = b.cardOptions?.year || 0;
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

const filteredPosts = computed(() => {
  return postsFilteredByCategory.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : postsFilteredByCategory.value;
  });
});

onMounted( async () => {
  anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 });
  updateColumns();
  window.addEventListener('resize', () => requestAnimationFrame(updateColumns));
});


let first = false;
watch([filteredPosts], async () => {
  await nextTick();
  if(!first) {
    requestAnimationFrame(() => measureAndPack());
    first = true;
  } else {
    requestAnimationFrame(() => measureAndPack(true));
  }

  }, {immediate:true, flush: 'post'});


</script>

<style>
/* #card-grid{
  grid-template-rows: masonry;
} */
</style>