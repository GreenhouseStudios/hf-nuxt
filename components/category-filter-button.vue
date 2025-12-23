<template>
    <input type="checkbox" class="hidden" />
    <label for="choose-me"
        class="select-none cursor-pointer dark:text-blue-300
        py-1 transition-colors duration-200 ease-in-out peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200  rounded-full border-2 border-gray-500 px-2 md:px-4 text-xs md:text-sm text-black font-light mr-5 mb-2 hover:bg-black hover:text-white hover:border-white"
        :class="{ 'bg-black text-white border-0': active }"
        @click="handleClicked">
        {{ category }} </label>

</template>

<script setup lang="ts">
defineProps<{
    category: String,
    active: boolean
}>()
const selected = ref(false)
const emit = defineEmits(['category-clicked'])
const handleClicked = () => {

    emit('category-clicked')
    console.log(selected.value)
}
</script>

<style scoped></style>