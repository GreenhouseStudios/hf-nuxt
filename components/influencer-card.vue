<template>
    <div class="flex flex-col overflow-hidden shadow-md rounded-2xl column p-6 bg-black text-white grow">
        <img :src="`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${height}/${width}`"
            class="bg-cover rounded-2xl" alt="">
        <div class="my-5 flex flex-col gap-2">
            <h1 class="text-3xl font-bold">Name</h1>
            <h2>Title Here</h2>
            <h3 class="h-24 overflow-ellipsis">Nostrud minim labore commodo sint consequat amet do exercitation
                exercitation...
            </h3>
        </div>
    </div>
</template>

<script lang="ts" setup>
const height = 300;
const width = 300;
</script>

<style scoped></style>