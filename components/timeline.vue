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
        <ul class="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8" id="card-grid" v-auto-animate>
          <li
              class="grid-item mx-auto w-full"
              v-for="(j, index) in filteredPosts"
              :key="index"
              :class="spans[index]"
          >
            <Card
                :post="j"
                :x-multiplier="1"
                :y-multiplier="1"
                mode="fixedHeight"
            />
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
import type { DropdownMenuItem } from '@nuxt/ui/dist/module'
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, computed, toRaw } from 'vue';
import { chunk } from 'es-toolkit';
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { useStore } from '~/stores/store';

const gridContainer = useTemplateRef('gridContainer');
const store = useStore();
const { data: posts } = usePosts();
const layoutModes = ref<DropdownMenuItem[]>([
  { label: 'Flex', icon: 'i-lucide-user'},
  { label: 'Grid', icon: 'i-lucide-user' },
]);
const selectedLayoutMode = ref<DropdownMenuItem>(layoutModes.value[0]);
const numCols = ref(4);

const span1 = 'col-span-1';
const span2 = 'col-span-1 sm:col-span-2';
const spans = ref<string[]>([]);

function updateColumns() {
  const width = window.innerWidth
  if (width >= 1536) numCols.value = 5
  else if (width >= 1280) numCols.value = 4
  else if (width >= 1024) numCols.value = 3
  else if (width >= 640) numCols.value = 2
  else numCols.value = 1
}

function prefersWide(index: number, row: number) {
  return (row % 2 === 0) ? (index % 3 === 0) : (index % 3 === 1);
}

function simulateWidths(cols: number, forceUpgrade: number | null) {
  const widths: number[] = [];
  if (cols < 2) {
    for (let i = 0; i < filteredPosts.value.length; i++) widths.push(1);
    return widths;
  }
  let slotsLeft = cols;
  let row = 0;
  let upgraded = false;

  for (let i = 0; i < filteredPosts.value.length; i++) {
    const shouldBeWide = prefersWide(i, row);

    let w = 1;
    if (slotsLeft >= 2 && shouldBeWide) w = 2;

    if (
        forceUpgrade !== null &&
        row === forceUpgrade &&
        !upgraded &&
        slotsLeft >= 2 &&
        w === 1
    ) {
      w = 2;
      upgraded = true;
    }

    widths.push(w);
    slotsLeft -= w;


    if(slotsLeft === 0) {
      row += 1;
      slotsLeft = cols;
    }
  }
  return widths;
}



function checkLastRow(cols: number, widths: number[]) {
  const totalSlots = widths.reduce((s, w) => s + w, 0);
  const remaining = totalSlots % cols;
  return remaining === 0 ? cols: remaining;
}

type Row = { start: number; end: number };

function rowsFromWidths(cols: number, widths: number[]): Row[] {
  const rows: Row[] = [];
  let used = 0, start = 0;
  for (let i = 0; i < widths.length; i++) {
    used += widths[i];
    if (used === cols) {
      rows.push({ start, end: i + 1 });
      start = i + 1;
      used = 0;
    }
  }
  if (start < widths.length) rows.push({ start, end: widths.length });
  return rows;
}

function updateSpans() {
  const cols = numCols.value;
  const n = filteredPosts.value.length;

  let widths = simulateWidths(cols, null);
  let lastRowCount = checkLastRow(cols, widths);
  if (cols >= 3 && n > cols && lastRowCount === 1) {
    const rows = rowsFromWidths(cols, widths);
    const secondLastIdx = rows.length - 2;
    const secondLastCount = secondLastIdx >= 0 ? rows[secondLastIdx].end - rows[secondLastIdx].start : 0;

    const secondLastSlots = secondLastIdx >= 0
        ? widths.slice(rows[secondLastIdx].start, rows[secondLastIdx].end).reduce((a, b) => a + b, 0)
        : 0;

    if (secondLastSlots === secondLastCount && cols === 3) {
      const i = toRaw(spans.value).length - 3;
      const i2 = toRaw(spans.value).length - 2;
      if (i >= 0 && i2 >= 0) {
        spans.value.splice(i, 1, span2);
        spans.value.splice(i2, 1, span2);
      }
    }

  } else if (cols === 2 && lastRowCount === 1) {
    if(widths[widths.length - 1] === 1 && widths[widths.length - 2] === 2) {
      spans.value.splice(widths.length - 2, 1, span1);
    }
  }

  let slotsLeft = cols;
  let row = 0;

  for (let i = 0; i < filteredPosts.value.length; i++) {
    const shouldBeWide = prefersWide(i, row);

    if (slotsLeft === 1) {
      spans.value.push(span1);
      slotsLeft = 0;
    } else if (shouldBeWide && slotsLeft >= 2) {
      spans.value.push(span2);
      slotsLeft -= 2;
    } else {
      spans.value.push(span1);
      slotsLeft -= 1;
    }

    if(slotsLeft === 0) {
      row += 1;
      slotsLeft = cols;
    }

  }


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


onMounted(async () => {
  anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 });
  updateColumns();
  updateSpans();
  window.addEventListener('resize', handleResize)
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch([filteredPosts, numCols], async () => {
  if (!filteredPosts.value.length) {
    spans.value = [];
    return;
  }

  const widths = simulateWidths(numCols.value, null);

  spans.value = widths.map(w => (w === 2 ? span2 : span1));

  await nextTick();

  handleResize();
}, { immediate: true, flush: 'post' });

function handleResize() {
  updateColumns();
  updateSpans();
}

</script>

<style>
/* #card-grid{
  grid-template-rows: masonry;
} */
</style>