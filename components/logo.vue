<template>
    <NuxtLink to="https://greaterhartfordgives.org/" target="_blank" style="z-index: 1;" class="fade-in relative" id="nav-img">
        <img
          src="~/public/GHGF_Logo_RGB_Primary.png"
          alt="Logo"
          class="object-contain max-h-14 md:h-14"
        />
      <h3 class="site-link text-sm mt-1.5 text-cetacean font-medium text-center px-2 py-1 absolute" >GreaterHartfordGives.org</h3>
    </NuxtLink>
</template>

<script setup lang="ts">
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

#nav-img:hover .site-link {
  transform: scale(1);
}

.site-link {
  background: #97CBFE;
  border-radius: 7px;
  right: -60px;
  bottom: -20px;
  transform-origin: top left;
  transform: scale(0);
  transition: transform .25s ease;
}

</style>