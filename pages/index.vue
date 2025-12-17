<style>


</style>
<template>
  <div>
    <Hero />

    <AboutTimeline id="about" />


    <TimelineComponent id="timeline" />
  </div>

  <InfluencersComponent id="influencers" />

</template>

<script lang="ts" setup>

import Hero from "~/components/hero.vue";
import AboutTimeline from "~/components/about-timeline.vue";
import TimelineComponent from "~/components/timeline-component.vue";
import InfluencersComponent from "~/components/influencers-component.vue";
</script>

<style></style>