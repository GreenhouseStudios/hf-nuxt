<template>
    <UInput placeholder="Search by keyword" v-model="store.searchTerm" icon="i-lucide-search" />
</template>

<script setup lang="ts">
const store = useStore();
</script>

<style scoped>

</style>