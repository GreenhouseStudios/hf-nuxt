<template>
    <input type="checkbox" class="hidden" />
    <label for="choose-me"
        class="select-none cursor-pointer
        py-1 transition-colors duration-200 ease-in-out peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200  rounded-full border-2 border-gray-500 px-2 md:px-4 text-sm text-black font-light mr-5 mb-2 hover:bg-black hover:text-white hover:border-0">
        {{ category }} </label>

</template>

<script setup lang="ts">
defineProps({
    category: String
})
</script>

<style scoped></style>