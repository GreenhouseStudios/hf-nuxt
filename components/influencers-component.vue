
<style scoped>
/* scoped or global */
.cards-grid {
  /* fixed row height so cards stay the same size by default */
  grid-auto-rows: 550px; /* tweak value */
  grid-auto-flow: dense;
}


.cards-move {
  transition: transform 250ms ease;
}
</style>


<template>
  <div class="px-12">
    <h1 class="text-5xl text-center mt-48 mb-24">Influencers</h1>

    <TransitionGroup
        tag="section"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start cards-grid"
        name="cards"
    >
      <InfluencerCard
          v-for="i in sortedInfluencers"
          :key="i.id"
          :influencer="i"
          :is-active="activeId === i.id"
          @click="toggleActive(i.id)"
      />
    </TransitionGroup>

  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useInfluencers } from '~/composables/useInfluencers'
import InfluencerCard from '~/components/influencer-card.vue'

const { data } = useInfluencers()
const influencers = computed(() => data.value ?? [])

const activeId = ref<string | null>(null)

const sortedInfluencers = computed(() => {
  return [...influencers.value].sort((a, b) =>
      a.influencerDetails.name.localeCompare(b.influencerDetails.name)
  )
})


// how many columns your `md:grid-cols-4` resolves to
const COLUMNS = 4

const toggleActive = (id: string) => {
  // only one open at a time – clicking the same one closes it
  activeId.value = activeId.value === id ? null : id
}
</script>
