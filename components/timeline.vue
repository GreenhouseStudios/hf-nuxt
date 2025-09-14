<style scoped>
.bento-grid {
  --gap: 25px;
  --row-h: 100px;
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  grid-auto-rows: var(--row-h);
  gap: var(--gap);
}

.bento-grid > li > div {
  height: 100%;
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
      <div v-else class="bento-wrap">
        <ul
            ref="gridRef"
            class="bento-grid" id="card-grid"
            :style="{'--cols': cols}"
        >
          <li
              v-for="(post, i) in filteredPosts"
              :key="post.id ?? i"
              :style="spanStyle(i)"
          >
              <Card
                  :post="post" class=""
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
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, computed, onBeforeUnmount } from 'vue';
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
const numCols = ref(4);
let cols = numCols.value;

type Post = { id: string | number }
const props = defineProps<{ posts: Post[] }>();

let rowHeight = 100;

const patterns: Record<number, Array<{ w:number; h: number }>> = {
  1: [
      { w: 1, h:4 },
      { w: 1, h:2 },
      { w: 1, h:3 }

  ],
  2: [
    { w: 1, h: 2 },
    { w: 1, h: 4 },
    { w: 2, h: 4 },
    { w: 1, h: 3 },
    { w: 2, h: 2 },
    { w: 1, h: 3 },
    { w: 1, h: 3 },
    { w: 2, h: 3 },
    { w: 1, h: 3 },
    { w: 1, h: 3 },
    { w: 1, h: 4 },
  ],
  3: [
    { w: 1, h: 3 },
    { w: 2, h: 3 },
    { w: 2, h: 4 },
    { w: 1, h: 5 },
    { w: 1, h: 3 },
    { w: 1, h: 3 },
    { w: 1, h: 2 },
    { w: 2, h: 3 },
    { w: 1, h: 3 },
  ],
  4: [
    { w: 1, h: 5 },
    { w: 2, h: 2 },
    { w: 2, h: 3 },
    { w: 1, h: 3 },
    { w: 2, h: 2 },
    { w: 1, h: 2 },
    { w: 1, h: 3 },
    { w: 1, h: 3 },
    { w: 2, h: 3 },
  ],
  5: [
    { w: 2, h: 3 },
    { w: 1, h: 3 },
    { w: 2, h: 2 },
    { w: 1, h: 4 },
    { w: 2, h: 2 },
    { w: 1, h: 3 },
    { w: 1, h: 3 },
    { w: 2, h: 4 },
    { w: 1, h: 3 },
    { w: 2, h: 3 },
    { w: 2, h: 4 },
  ]
}

const gridRef = ref<HTMLElement | null>(null);
let ro: ResizeObserver | null = null;

function updateColumns() {
  const width = window.innerWidth
  if (width >= 1536) numCols.value = 5
  else if (width >= 1280) numCols.value = 4
  else if (width >= 1024) numCols.value = 3
  else if (width >= 640) numCols.value = 2
  else numCols.value = 1
  cols = numCols.value;
}

function spanFor(index: number): {w: number, h: number} {
  const pattern = patterns[numCols.value] ?? patterns[1];
  const pick = pattern[index % pattern.length];
  const w = Math.min(pick.w, numCols.value);
  return {w, h: pick.h}
}

function spanStyle(i: number) {
  const { w, h } = spanFor(i);
  return {
    gridColumn: `span ${w} / span ${w}`,
    gridRow: `span ${h} / span ${h}`,
    minHeight: `${rowHeight * h}px`,
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


onMounted( () => {
  anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 });
  updateColumns();

  ro = new ResizeObserver(() => updateColumns());
  if (gridRef.value) ro.observe(gridRef.value);
});
onBeforeUnmount(() => ro?.disconnect())


/*
watch([filteredPosts, numCols], async () => {
  await nextTick();
  ro?.disconnect();
  for (const el of innerEls.value) if (el) ro!.observe(el);
  measureAll()
  }, {immediate:true, flush: 'post'});
*/

</script>

<style>
/* #card-grid{
  grid-template-rows: masonry;
} */
</style>