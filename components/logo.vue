<template>
    <NuxtLink to="/" style="z-index: 1;">
        <img id="nav-img" style="transition: clip-path .75s ease-in-out ; clip-path: inset(0% 0% 0% 21%);" src="~/public/image.png" alt="Logo" class="object-contain max-h-8 md:h-8 clipped" />
    </NuxtLink>
</template>

<script setup lang="ts">

</script>

<style scoped>
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