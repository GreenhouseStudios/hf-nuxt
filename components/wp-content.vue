<script lang="ts" setup>
const props = defineProps<{
    content: string;
}>();
</script>

<template>
    <div v-html="props.content" class="wp-content"></div>
</template>

<style >
@import url('./assets/css/wp-block-library.css');
  @import url('./assets/css/hello-elementor-style.min.css');
  @import url('./assets/css/theme.min.css');
  @import url('./assets/css/global-styles-inline.css');
::v-deep(.wp-content) {
  @import url('./assets/css/wp-block-library.css');
  @import url('./assets/css/hello-elementor-style.min.css');
  @import url('./assets/css/theme.min.css');
  color: white;
}

</style>
