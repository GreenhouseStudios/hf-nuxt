<template>
    <div class="px-24">
        <h1 class="text-5xl py-24 px-24">Influencers</h1>
        <section  class="grid grid-cols-4 gap-4 items-start align-top">
            <!-- <influencer-card v-for="i in 50"></influencer-card> -->
           <InstagramEmbed v-for="i in postCodes" :code="i"/>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';    
import InstagramEmbed from '~/components/instagram-embed.vue';
import { useAsyncData } from '#app';
const postCodes = [
    'DKAIPrUzS9C',
    'DJ7GfY-h3dU',
     'DKSJzqOAv90',
    'DJ7GfY-h3dU',
     'DKAIPrUzS9C',
    'DJ7GfY-h3dU',
     'DKAIPrUzS9C',
    'DJ7GfY-h3dU',
]

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

onMounted(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
});
</script>

<style scoped>

</style>
