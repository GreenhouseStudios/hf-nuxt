<template>
    <div
      class="flex flex-col overflow-hidden shadow-md rounded-2xl column p-6 bg-black text-white grow dark:bg-gray-800"
    >
      <img
        :src="influencer.influencerDetails.image?.node?.sourceUrl || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${height}/${width}`"
        class="bg-cover rounded-2xl"
        :alt="influencer.influencerDetails.name"
      />
      <div class="my-5 flex flex-col gap-2">
        <h1 class="text-3xl font-bold">{{ influencer.influencerDetails.name }}</h1>
        <h2>{{ influencer.influencerDetails.title }}</h2>
        <h3 class="h-24 overflow-hidden text-ellipsis">
          {{ influencer.influencerDetails.description }}
        </h3>
      </div>
    </div>
  </template>
  

<script setup lang="ts">
defineProps<{
  influencer: {
    id: string;
    title: string;
    influencerDetails: {
      name: string;
      title: string;
      description: string;
      image?: {
        node?: {
          sourceUrl: string;
        };
      };
    };
  };
}>();

const height = 300;
const width = 300;
</script>


<style scoped></style>