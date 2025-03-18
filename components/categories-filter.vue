<template>
    <div class="flex flex-wrap w-1/3 mt-5">
        <CategoryFilterButton v-for="cat in categories" :key="cat" :category="cat" />
    </div>
</template>

<script setup lang="ts">
const categories = ['The Arts', 'Thriving Neighborhoods', 'Basic Needs', 'Our Childrens Future', 'Donors', 'Resident Voices', 'Preserving Our Place', 'Employment']
</script>

<style scoped>

</style>