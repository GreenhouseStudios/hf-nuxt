<template>
    <div class="overflow-visible overflow-x-hidden relative">
        <Nav/>

        <div class="hf-page">
            <slot />
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.hf-page {
    min-height: 70vh;
    margin: 70px auto;
}
</style>