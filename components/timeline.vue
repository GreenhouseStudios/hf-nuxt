<template>
  <!-- <div class="mx-auto container" style="width:1200px">
      <Card v-for="i in 30" :key="i" />
  </div> -->
  <div class="my-36 px-24 md:px-12">
    <h1 class="text-blue-950 text-9xl font-black">OUR TIMELINE</h1>
    <section>
      <Filters />
    </section>

    <!-- Card Grid Layout -->
    <section class="flex justify-between">
      <div class="mx-auto flex gap-8 justify-between">
        <div class="flex flex-col w-72 gap-5 justify-start" v-for="j in 4">
          <Card v-for="i in 5" random />
        </div>
      </div>
    </section>

    <section class="my-5 px-18">
      <div class="grid grid-cols-2 mx-auto gap-8">
        <decade-card v-for="i in 4"/>
      </div>
    </section>

  </div>
</template>

<script lang="ts" setup>
const { data: posts } = usePosts();
</script>

<style>
.container {
  /* display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: masonry; */

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1rem;
  grid-template-rows: masonry;
}
</style>