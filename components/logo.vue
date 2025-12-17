<template>
    <NuxtLink to="/" style="z-index: 1;">
        <img
          id="nav-img"
          src="~/public/image.png"
          alt="Logo"
          class="object-contain max-h-8 md:h-8 img-transition"
          :class="clip ? 'clipped' : ''"
        />
    </NuxtLink>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "#imports";

const width = ref(window.innerWidth);
const clip = computed(() => width.value > 1150);
onMounted(() => {
  width.value = window.innerWidth
})
</script>

<style scoped>
.img-transition {
  transition: clip-path .75s ease-in-out
}
.partial-clip {
  clip-path: inset(0% 0% 0% 21%);
}
.clipped {
  clip-path: inset(0% 0% 0% 100%) !important;
}
.fade {
  animation: fade .5s ease-in .25s forwards;
}
@keyframes fade {
  from {opacity: 0;}
  to {opacity: 1;}
}

</style>