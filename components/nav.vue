<template>
  <div class="flex items-center justify-between px-4 md:py-4 fixed z-100 top-0 ">

    <Logo></Logo>

    <NavMenu :items="items" class="hidden md:flex md:gap-5"/>


    <USlideover class="max-w-36" v-model:open="isOpen" close-icon="i-lucide-arrow-right" :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }">
      <template #title>
        <div class="text-lg font-semibold text-right">Greater Hartford Gives Centennial</div>
      </template>
      <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          @click="isOpen = true"
          class="md:hidden text-cetacean text-3xl"

      />
      <template #body style="padding-right: 0">
        <div class="flex flex-col">
          <UButton
            v-for="item in items"
            :key="item.sectionID"
            block
            variant="ghost"
            :label="item.label"
            :class="item.active
              ? 'font-bold'
              : 'text-black'"
            class="justify-end w-fit mr-0 ml-auto"
            :style="item.active ? 'color: #0a7aff':''"
            @click="() => handleClick(item.sectionID)"/>
        </div>
      </template>
    </USlideover>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import NavMenu from "~/components/nav-menu.vue";
import Logo from "~/components/logo.vue";
import {useNuxtApp} from "#imports";

const { $gsap } = useNuxtApp();

const props = withDefaults(
    defineProps<{
      active?: string | null
    }>(),
    {
      active: null
    }
)




const handleClick = (sectionID: string) => {
  const section = document.getElementById(sectionID);
  if(!section) {
    isOpen.value = false
    return;
  }
  $gsap.to(window, {
    duration: .75,
    ease: 'power1.inOut',
    scrollTo: {
      y: section,
      offsetY: 100,
    },
    onComplete: () => {
      isOpen.value = false;
    }
  })
};

const scrollToSection = (sectionID: string) => {

}

const isOpen = ref(false);

const items = computed<NavItem[]>(() => { return [
  {
    label: 'OVERVIEW',
    sectionID: 'overview',
    active: props.active === 'overview'
  },
  {
    label: 'TIMELINE',
    sectionID: 'timeline',
    active: props.active === 'timeline'
  },
  {
    label: 'INFLUENCERS',
    sectionID: 'influencers',
    active: props.active === 'influencers'
  }
] })
watch(
    () => props.active,
    (val, oldVal) => {
      console.log('active changed:', oldVal, '→', val)
    },
    { immediate: true }
)
</script>

<style scoped>
div {
  background: white;
}
.text-active {
  color: #0a7aff !important;
}


</style>