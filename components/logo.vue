<template>
    <NuxtLink to="/" style="z-index: 1;">
        <img
          id="nav-img"
          src="~/public/image.png"
          alt="Logo"
          ref="logoEl"
          class="object-contain max-h-8 md:h-8 fade-in img-transition"

        />
    </NuxtLink>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, nextTick } from "vue";
import { useFirstVisit } from "~/composables/useFirstVisit";

const { ready, hasSeen } = useFirstVisit();
const shouldClip = computed(() => ready.value && !hasSeen.value && window.innerWidth > 1150);

const logoEl = ref<HTMLImageElement | null>(null);

watch(
    () => ready.value,
    async (isReady) => {
      if (!isReady) return
      console.log('seen');
      console.log(hasSeen)
      await nextTick()
      setClip()
    },
    { immediate: true }
)
const width = ref(window.innerWidth);
onMounted(() => {
  width.value = window.innerWidth
})



function setClip() {
  if(!logoEl.value) return;
  if(shouldClip.value) {
    logoEl.value.classList.add('clipped');
  }
}

</script>

<style scoped>
.fade-in {
  opacity: 0;
  animation: fade-in .25s .25s forwards;
}

@keyframes fade-in {
  from { opacity: 0 }
  to { opacity: 1 }
}

.img-transition {
  transition: clip-path .75s ease-in-out;
}
.partial-clip {
  clip-path: inset(0% 0% 0% 21%);
}
.clipped {
  clip-path: inset(0% 0% 0% 100%) !important;
}


</style>