<template>
  <div class="max-w-screen mb-36 px-2 py-12 md:px-12 overflow-x-hidden">
    <h1 class="text-blue-950 text-5xl md:text-9xl font-black timeline-title dark:text-blue-300">OUR TIMELINE</h1>
    <section>
      <Filters />
      <select class="select select-bordered w-full max-w-xs mt-4 border-2 border-black ml-24 my-5" v-model="selectedLayoutMode">
        <option v-for="mode in layoutModes" :key="mode.label" :value="mode">{{ mode.label }}</option>
      </select>
    </section>

    <!-- Card Grid Layout (Flex)-->
    <section class="flex justify-between" v-if="selectedLayoutMode.label === 'Flex'">
      <ul class="mx-auto flex md:flex-row flex-col gap-8 justify-between" v-auto-animate>
        <li class="flex flex-col sm:w-full md:w-1/4 gap-5 justify-start" v-for="(j, index) in postGroups" :key="index">
          <Card v-for="i in j" :post="i" :x-multiplier="1" :y-multiplier="1" mode="autoHeight" />
        </li>
      </ul>
    </section>

    <!-- Card Layout (CSS Grid) -->
    <section class="flex justify-around" v-else-if="selectedLayoutMode.label === 'Grid'">
      <ul class="mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8" id="card-grid" v-auto-animate>
        <li class="grid-item mx-auto" v-for="(j, index) in filteredPosts" :key="index"
          :class="index % 7 == 2 ? 'md:col-span-2' : ''">
          <Card :post="j" :x-multiplier="index % 6 == 1 ? 2 : 1" :y-multiplier="1" mode="fixedHeight"/>
        </li>
      </ul>
    </section>

    <!-- <section class="flex justify-between " >
      <ul ref="gridContainer" class="grid-stack w-full">
        <li v-for="(post, index) in postsArray" :key="index" :gs-w="3" :gs-h="4" :gs-x="(index)%12"
        :gs-y="Math.floor((index) / 12)" class="grid-stack-item">
          <Card :post="post" class="m-4"  />
        </li>
      </ul>
    </section> -->

    <!-- <section class="grid gap-8 grid-cols-4 auto-rows-auto">
      <Card v-for="card in posts" :post="card" :key="card.slug"></Card>
    </section> -->

    <!-- <section class="flex flex-wrap mx-auto">
      <div v-for="card in posts" class="p-2 inline w-1/4" :key="card">
        <Card :post="card" />
      </div>
    </section> -->

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
const filteredPosts = computed(() => {
  return postsArray.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : true;
  });
});
const postGroups = computed(() => {
  const n = numCols.value;
  return store.timelineFilterCategories.length > 0 ? filteredPosts.value.filter((post: Post) => {
    return post.categories.nodes.some((category: Category) =>
      store.timelineFilterCategories.map(c => c.slug).includes(category.slug)
    );
  }) : filteredPosts.value.reduce((acc, item, i) => {
    acc[i % n].push(item);
    return acc;
  }, Array.from({ length: n }, () => []));
});

onMounted(async () => {
  anime({ targets: '.timeline-title', translateX: [-200, 0], duration: 700 });
  updateColumns()
  window.addEventListener('resize', updateColumns)
  // imagesLoaded('#card-grid', () => {
  //   new Masonry('#card-grid', {
  //     gutter: 20,
  //     columnWidth: 300,
  //     itemSelector: '.grid-item',
  //   });
  // });
onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
})
});

// watch(postsArray, async (newPosts) => {
//   if (newPosts.length > 0) {
//     await nextTick(); // let Vue render all grid items

//     console.log('GridStack items:', gridContainer.value?.querySelectorAll('.grid-stack-item'));

//     GridStack.init({
//       column: 12,
//       minRow: 10,
//       sizeToContent: true,
//       // cellHeight: '25px',
//       margin: 10,
//     });
//   }
// });
</script>

<style>
/* #card-grid{
  grid-template-rows: masonry;
} */
</style>