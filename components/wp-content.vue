<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
const props = defineProps<{
  content: string;
  url: string;
}>();

// const wrapper = ref<HTMLElement | null>(null);

// onMounted(() => {
//   const style = document.createElement('style');
//   style.innerHTML = `
//     @import url('https://leamh.org/hartford_foundation/wp-includes/css/dist/block-library/style.min.css?ver=6.7.2');
//     @import url('https://leamh.org/hartford_foundation/wp-content/themes/hello-elementor/theme.min.css?ver=3.3.0');
//     @import url('https://leamh.org/hartford_foundation/wp-content/themes/hello-elementor/style.min.css?ver=3.3.0');
//   `;
//   wrapper.value?.appendChild(style);
// });

// const myIframe = ref(null);

// onMounted(() => {
//   if (myIframe.value) {
//     const iframeDoc = myIframe.value?.contentWindow.document;
//     const style = document.createElement("style");
//     style.innerHTML = `
//       #site-header, .entry-title { display: none !important; }
//     `;
//     iframeDoc.head.appendChild(style);
//   }
// });
</script>

<template>
  <!-- <div v-html="props.content" class="wp-content" v-show="props.content" ref="wrapper"></div> -->
   <div class="iframe-container"><iframe :src="url" frameborder="0" ref="myIframe"></iframe></div>
</template>

<style scoped>
.iframe-container{
  width:100vw;

}

iframe {
  width: 100vw; /* Makes iframe take up full width */
  height: 100vh; /* Set a fixed height, or make it dynamic */
  border: none; /* Removes default border */
}
/* @import url('~/assets/css/wp/wp-block-library.css'); */
/* @import url('~/assets/css/wp/hello-elementor-style.min.css'); */
/* @import url('~/assets/css/wp/theme.min.css'); */
/* @import url('~/assets/css/wp/global-styles-inline.css'); */
</style>