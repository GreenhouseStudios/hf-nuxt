<template>
  <div class="mb-36 px-4 md:px-24">
    <h1 class="text-blue-950 text-5xl md:text-9xl font-black timeline-title dark:text-blue-300">OUR TIMELINE</h1>
    <section>
      <Filters />
    </section>

    <!-- Card Grid Layout -->
    <section class="flex justify-between" >
      <ul class="mx-auto flex md:flex-row flex-col gap-8 justify-between" v-auto-animate>
        <li class="flex flex-col w-72 gap-5 justify-start" v-for="(j,index) in postGroups" :key="index">
          <Card v-for="i in j" :post="i" />
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
import { nextTick, onMounted , ref, useTemplateRef, watch} from 'vue';
import { chunk } from 'es-toolkit';
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css';

const gridContainer = useTemplateRef('gridContainer');
const store = useStore();
const { data: posts } = usePosts();
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
  const n = 5;
  return store.timelineFilterCategories.length > 0 ? filteredPosts.value.filter((post: Post) => {
      return post.categories.nodes.some((category: Category) =>
        store.timelineFilterCategories.map(c => c.slug).includes(category.slug)
      );
    })  : filteredPosts.value.reduce((acc, item, i) => {
    acc[i % n].push(item);
    return acc;
  }, Array.from({ length: n }, () => []));;
});

onMounted( async () => {
  anime({ targets: '.timeline-title', translateX: [-200,0], duration: 700 });
});

watch(postsArray, async (newPosts) => {
  if (newPosts.length > 0) {
    await nextTick(); // let Vue render all grid items

    console.log('GridStack items:', gridContainer.value?.querySelectorAll('.grid-stack-item'));

    GridStack.init({
      column: 12,
      minRow: 10,
      sizeToContent: true,
      // cellHeight: '25px',
      margin: 10,
    });
  }
});
</script>

<style>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1rem;
  grid-template-rows: masonry;
}
</style>