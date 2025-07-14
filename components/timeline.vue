<template>
  <div class="max-w-screen mb-36 px-2 py-12 md:px-12 overflow-x-hidden">
    <h1 class="text-blue-950 text-5xl md:text-9xl font-black timeline-title dark:text-blue-300">OUR TIMELINE</h1>
    <section>
      <Filters />
    </section>

    <!-- Card Layout (CSS Grid) -->
    <section class="flex justify-around">
      <ul class="mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8" id="card-grid" v-auto-animate>
        <li
          class="grid-item mx-auto w-full"
          v-for="(j, index) in filteredPosts"
          :key="index"
          :class="getSpanClass(index)"
        >
          <Card
            :post="j"
            :x-multiplier="1"
            :y-multiplier="1"
            mode="fixedHeight"
          />
        </li>
      </ul>
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
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, computed } from 'vue';
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

function updateColumns() {
  const width = window.innerWidth
  if (width >= 1024) numCols.value = 4
  else if (width >= 768) numCols.value = 2
  else if (width >= 640) numCols.value = 1
  else numCols.value = 1
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
      );w
    });
  }
  return postsArray.value;
});

const filteredPosts = computed(() => {
  return postsFilteredByCategory.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : postsFilteredByCategory.value;
  });
});

function getSpanClass(index: number) {
  const itemsPerRow = 4;
  const patternLength = 6;
  const wideCardPositions = [0,1,2,3,2,1];

  const virtualRow = Math.floor(index / itemsPerRow);
  const positionInPattern = virtualRow % patternLength;
  const widePosition = wideCardPositions[positionInPattern];

  const indexInRow = index % itemsPerRow;

  return indexInRow === widePosition ? 'col-span-1 sm:col-span-2' : 'col-span-1';
}

onMounted(async () => {
  anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 });
  updateColumns()
  window.addEventListener('resize', updateColumns)
onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
})
});
</script>

<style>
/* #card-grid{
  grid-template-rows: masonry;
} */
</style>