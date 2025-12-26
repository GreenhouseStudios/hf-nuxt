<style scoped>
.bufferMargin {
  margin-top: var(--neg-margin);
}

</style>
<template ref="influenWrapEl" style="--neg-margin: 0px">
  <section>
    <div class="px-6 md:px-12">
      <h1 class="text-5xl text-center mt-48 mb-24">Influencers</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <InfluencerCard
            v-for="influencer in sortedInfluencers"
            :key="influencer.id"
            :influencer="influencer"
            @click="openModal(influencer)"
        />
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInfluencers } from '~/composables/useInfluencers'
import { useStore } from '~/stores/store'
import InfluencerCard from '~/components/influencer-card.vue'

const { data } = useInfluencers()
const store = useStore()

const influencers = computed(() => data.value ?? [])

const sortedInfluencers = computed(() => {
  return [...influencers.value].sort((a, b) =>
      a.influencerDetails.name.localeCompare(b.influencerDetails.name)
  )
})

const influenWrapEl = ref<HTMLElement | null>(null);

const width = ref(window.innerWidth);
const rowHeight = 100;
const bufferRows = 5;
function checkTlBuffer() {
  width.value = window.innerWidth;
  if(width.value > 1380 && influenWrapEl.value) influenWrapEl.value.style.setProperty('--neg-margin', `${bufferRows * rowHeight}px`);
}

const openModal = (influencer: any) => {
  store.openModal(influencer)
}
</script>
