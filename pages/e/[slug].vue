<script setup lang="ts">
import { useRoute, useHead, navigateTo } from "#imports";

const route = useRoute();
const slug = String(route.params.slug);

const prettyUrl = `https://100years.greaterhartfordgives.org/e/${encodeURIComponent(slug)}`;

useHead({
  link: [{ rel: "canonical", href: prettyUrl }],
  meta: [{ property: "og:url", content: prettyUrl }],
});

if (process.client) {
  await navigateTo(`/?event=${encodeURIComponent(slug)}`, { replace: true });
}
</script>

<template>
  <noscript>
    <meta http-equiv="refresh" :content="`0;url=/?event=${encodeURIComponent(slug)}`" />
  </noscript>
</template>
