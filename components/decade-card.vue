<template>
    <div class=" overflow-hidden shadow-md rounded-2xl hover:bg-gray-200"
        @click="handleCardClick">
        <decade-content />
    </div>
</template>

<script setup lang="ts">
import { useStore } from '~/stores/store';
const store = useStore();
const handleCardClick = () => {
    showModal();
}
const showModal = () => {
    store.toggleModal();
}
</script>

<style scoped></style>