<template>
    <div class=" flex flex-wrap md:w-1/2 mt-2 md:mt-5">
        <CategoryFilterButton v-for="cat in displayCategories" :key="cat.slug" :category="cat.name" @categoryClicked="handleCategoryClick(cat)" />
    </div>
    <!-- <div v-for="cat in store.timelineFilterCategories" :key="cat.slug">
        {{ cat }}

    </div> -->
</template>

<script setup lang="ts">
import { useStore } from '~/stores/store';
import { computed } from 'vue';
import { useCategories } from '~/composables/useCategories.js';

const store = useStore();


const {data: categories} = useCategories()
const displayCategories = computed(() => {
    return categories.value?.filter((cat: Category) => cat.name.toLowerCase() !== 'uncategorized')
})
const handleCategoryClick = (category: Category) => {
    const exists = store.timelineFilterCategories.some(cat => cat.slug === category.slug);
    
    if (exists) {
        store.setFilterCategories(
            store.timelineFilterCategories.filter(cat => cat.slug !== category.slug)
        );
    } else {
        store.setFilterCategories([...store.timelineFilterCategories, category]);
    }
}
</script>