<template>
  <div class="mb-36 px-4 md:px-24">
    <h1 class="text-blue-950 text-5xl md:text-9xl font-black timeline-title">OUR TIMELINE</h1>
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

    <!-- <section class="grid gap-8 grid-cols-4 auto-rows-auto">
      <Card v-for="card in posts" :post="card" :key="card.slug"></Card>
    </section> -->

    <!-- <section class="flex flex-wrap mx-auto">
      <div v-for="card in posts" class="p-2 inline w-1/4" :key="card">
        <Card :post="card" />
      </div>
    </section> -->

    <section class="my-5 md:px-18 px-2">
      <div class="grid md:grid-cols-2 grid-cols-1 mx-auto gap-8">
        <decade-card v-for="i in 4" />
      </div>
    </section>

  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
import { onMounted } from 'vue';
import { chunk } from 'es-toolkit';
const store = useStore();
const { data: posts } = usePosts();
const postsArray = computed(() => Array.isArray(posts.value) ? posts.value : [] as Post[]);
const filteredPosts = computed(() => {
  return postsArray.value.filter((post: Post) => {
    return store.searchTerm.length > 0 ? post.title.toLowerCase().includes(store.searchTerm.toLowerCase()) : true;
  });
});
const postGroups = computed(() => {
  return store.timelineFilterCategories.length > 0 ? chunk(filteredPosts.value.filter((post: Post) => {
      return post.categories.nodes.some((category: Category) =>
        store.timelineFilterCategories.map(c => c.slug).includes(category.slug)
      );
    }),3) : chunk(filteredPosts.value, 3);
});

onMounted(() => {
  anime({ targets: '.timeline-title', translateX: [-200,0], duration: 700 });
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