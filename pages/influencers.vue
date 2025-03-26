<template>
    <div class="px-24">
        <h1 class="text-5xl py-24 px-24">Influencers</h1>
        <section  class="grid items-center grid-cols-4 gap-4">
            <influencer-card v-for="i in 50"></influencer-card>
        </section>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>