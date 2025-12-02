<template>
    <div
      class="flex flex-col overflow-hidden rounded-2xl column influencer-card"
    >
      <div class="card-wrap rounded-2xl" ref="cardWrapEl">
        <div class="details-wrap">
          <span class="details-town text-lg font-bold shown">
            {{ influencer.influencerDetails.town || 'Hartford' }}
          </span>
          <h3 class="details-name font-bold">
            {{ influencer.influencerDetails.name }}
          </h3>
          <span class="details-title text-lg font-bold">
            {{ influencer.influencerDetails.title || 'Influencer' }}
          </span>
        </div>

        <div class="details-bg" />
        <img
            :src="influencer.influencerDetails.image?.node?.sourceUrl || './public/placeholder.png'"
            class="bg-cover rounded-2xl headshot"
            :alt="influencer.influencerDetails.name"
        />
      </div>

      <div class="my-5 flex flex-col gap-2 hidden">
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
      town: string,
      description: string;
      image?: {
        node?: {
          sourceUrl: string;
        };
      };
    };
  };
}>();
import { ref, onUpdated, nextTick, onMounted} from 'vue';

const cardWrapEl = ref<HTMLElement | null>(null);
let hoverSet = false;
async function setup() {
  if(hoverSet) return;
  hoverSet = true;
  await nextTick();
  console.log(cardWrapEl.value)
  if(cardWrapEl.value) {
    const title = cardWrapEl.value.querySelector('.details-title');
    const town = cardWrapEl.value.querySelector('.details-town');
    const detailsBG = cardWrapEl.value.querySelector('.details-bg');
    const detailsWrap = cardWrapEl.value.querySelector('.details-wrap');

    cardWrapEl.value.addEventListener('pointerenter', () => {
      cardWrapEl.value?.classList.add('hover');
      title?.classList.add('shown');
      town?.classList.remove('shown');
      detailsBG?.classList.add('hover');
      detailsWrap?.classList.add('hover');
    })
    cardWrapEl.value.addEventListener('pointerleave', () => {
      cardWrapEl.value?.classList.remove('hover');
      title?.classList.remove('shown');
      town?.classList.add('shown');
      detailsBG?.classList.remove('hover');
      detailsWrap?.classList.remove('hover');
    })
  }
}

onUpdated(async () => {
  await setup();
})

onMounted(async () => {
  await setup();
})



</script>


<style scoped>
.influencer-card {
  width: 21vw;
  height: calc(20vw * 1.4);
}

.card-wrap::after {
  position: absolute;
  content: '';
  width: 105%;
  background: url("../public/town-bg.png") no-repeat;
  height: auto;
  background-size: cover;
  aspect-ratio: 2.4/1;
  bottom: 0;
  left: 3px;
  z-index: 3;
  transition: transform .75s ease, opacity .5s;
  transform: translateY(125px);
  opacity: 0;
  will-change: transform;
}

.card-wrap.hover::after {
  transform: translateY(0) !important;
  opacity: 1 !important;
}

.card-wrap {
  height: 100%;
  width: 100%;
  position: relative;
  border: 1px solid white;
  overflow: hidden;

}

.headshot {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center top;
}
.details-bg {
  position: absolute;
  width: 125%;
  aspect-ratio: 1.125 / 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1125 1000'><ellipse cx='562.5' cy='500' rx='562.5' ry='500' fill='white'/></svg>");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  left: -3%;
  bottom: 35%;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  z-index: 1;
  transition: transform .75s ease;
  will-change: transform;
}

.details-bg.hover {
  transform: translateY(75%) !important;
}


.details-name {
  color: var(--color-cetacean);
  font-size: 26px;
  max-width: 90%;

}
.details-title,.details-town {
  color: #0C6DD4;
  transition: transform .75s ease, opacity .5s ease;
  max-width: 75%;
  will-change: transform;
}

.details-title.shown, .details-town.shown {
  transform: translateY(0) !important;
  opacity: 1 !important;
}
.details-town {
  opacity: 0;
  transform: translateY(-100px);
}

.details-title {
  opacity: 0;
  transform: translateY(100px);
}

.details-wrap {
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: end;
  right: 0;
  bottom: -15px;
  z-index: 2;
  width: 100%;
  padding-right: 5%;
  transform: translateY(0);
  transition: transform .75s ease;
  text-align: end;
  will-change: transform;
}
.details-wrap.hover {
  transform: translateY(-125px);
}

</style>