<template>
    <div class=" flex flex-wrap  mt-5">
        <CategoryFilterButton
            v-for="cat in displayCategories"
            :key="cat.slug"
            :category="cat.name"
            :active="store.timelineFilterCategory?.slug === cat.slug"
            @categoryClicked="handleCategoryClick(cat)"
        />
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
  const currCategory = store.timelineFilterCategory;

    if(currCategory?.slug === category.slug) store.clearFilterCategory();
    else store.setFilterCategory(category);

}
</script>