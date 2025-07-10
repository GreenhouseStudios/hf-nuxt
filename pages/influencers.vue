<template>
    <div class="px-24">
        <h1 class="text-5xl py-24 px-24">Influencers</h1>
        <section  class="grid grid-cols-4 gap-4 items-start align-top">
            <influencer-card v-for="i in 50"></influencer-card>
           <!-- <InstagramEmbed v-for="i in postCodes" :code="i"/> -->
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';    
import InstagramEmbed from '~/components/instagram-embed.vue';
import { useAsyncData } from '#app';
const postCodes = [
   'DKSJzqOAv90','DKAIPrUzS9C','DJ7GfY-h3dU','DJrh4oav5Hy','DJZnJ2IxWtl','DJKGaYtpHES','DI4B9yntZk5','DIwTk5xsfcn','DIjbqJmM0r7','DIJrqvruhy8','DIAL4YyNlyY','DH6O45PtNdr','DHtW6oJxxXW','DHlthXdp2ap','DHbpembPgdz','DHTm-9Et8D'
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
