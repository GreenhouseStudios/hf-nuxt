<template>
    <UInput 
        placeholder="Search by keyword" 
        v-model="store.searchTerm" 
        icon="i-lucide-search"
        class="search-input"
    />
</template>

<script setup lang="ts">
import { useStore } from '~/stores/store';

const store = useStore();
</script>

<style scoped>
:deep(.search-input input) {
    border: 2px solid rgb(107, 114, 128) !important; /* border-gray-500 */
    border-radius: 9999px; /* rounded-full */
}

:deep(.search-input) {
    border-radius: 9999px;
}
</style>