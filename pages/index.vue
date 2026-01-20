<style>
</style>
<template>

    <AboutTimeline id="overview" />


    <TimelineComponent id="timeline" />
  

    <InfluencersComponent id="influencers" />
</template>

<script lang="ts" setup>

import AboutTimeline from "~/components/about-timeline.vue";
import TimelineComponent from "~/components/timeline-component.vue";
import InfluencersComponent from "~/components/influencers-component.vue";
import {usePosts} from "~/composables/usePosts";
import {useStore} from "~/stores/store";
import { onMounted, nextTick, computed, watch, ref } from "vue";
const { data:posts } = usePosts();
const store = useStore();

const slug = ref<string | null>(null);

onMounted(async () => {
  await nextTick()



  const params = new URLSearchParams(window.location.search);
  const query = params.get('event')
  if(query) slug.value = query;
})


watch([posts], async () => {

  if(posts.value && slug.value) {
    const searchedPost = posts.value.find(p => p.slug === slug.value);
    console.log(searchedPost)
    const key = `searchedEvent:${searchedPost?.slug}`;
    const type = searchedPost?.eventOptions.postType || null;

    const isDefault = type === 'default' || type === 'covid_post';

    if(
        searchedPost &&
        isDefault &&
        sessionStorage.getItem(key) !== '1'
    ) {
      sessionStorage.setItem(key, '1');
      store.openModal(searchedPost)
    }

  }
})

</script>