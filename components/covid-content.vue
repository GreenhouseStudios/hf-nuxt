<style scoped>

#quote {
  margin: 0 !important;
}
#text-grow {
  transition: opacity .2s;
  text-align: left;
  padding-left: 25px;
}



</style>

<template>
      <h2 id="title-shrunk" class="text-5xl font-bold" style="transition: opacity .3s">
        {{ props?.post?.title }}
      </h2>
      <p id="text-grow" class="text-2xl" style="opacity: 0; display: none">
        {{ props?.post?.cardOptions?.cardDescription }}
      </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: Post
}>();
</script>