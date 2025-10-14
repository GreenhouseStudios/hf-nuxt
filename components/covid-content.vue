<style scoped>

#quote {
  margin: 0 !important;
}
#text-grow {
  transition: opacity .2s;
  text-align: left;
  padding-left: 25px;
}

h2 {
  font-size: xxx-large !important;
  font-weight: bolder !important;
}

</style>

<template>
      <h2 id="title-shrunk" style="transition: opacity .3s">
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