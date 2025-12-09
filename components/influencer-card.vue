<template>
  <div
      class="flex flex-col overflow-hidden rounded-2xl column influencer-card"
      :class="{ 'influencer-card--active': isActive }"
      @click="emit('click');"
      ref="gridWrapEl"
  >
    <div class="card-inner" ref="cardInnerEl">
      <div class="card-wrap rounded-2xl" ref="cardWrapEl">
        <div class="details-wrap">
          <span class="details-town text-md font-bold shown">
            {{ influencer.influencerDetails.town || 'Hartford' }}
          </span>
          <h3 class="details-name text-3xl font-bold">
            {{
              influencer.influencerDetails.honorific
                  ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
                  : `${influencer.influencerDetails.name}`
            }}
          </h3>
          <span class="details-title text-md font-bold text-nowrap">
            {{ influencer.influencerDetails.title || 'Influencer' }}
          </span>
        </div>

        <div class="details-bg" />
        <img
            :src="influencer.influencerDetails.image?.node?.sourceUrl || './public/placeholder.png'"
            class="bg-cover rounded-2xl headshot"
            :alt="influencer.influencerDetails.name"
            ref="cardImgEl"
        />
        <h2 class="details-name-active font-bold text-center mt-7">
          {{ influencer.influencerDetails.honorific
            ? `${influencer.influencerDetails.honorific} ${influencer.influencerDetails.name}`
            : `${influencer.influencerDetails.name}`
          }}
        </h2>
        <p class="description-text text-lg">
          {{ influencer.influencerDetails.description }}
        </p>
      </div>

    </div>



  </div>
</template>

<script setup lang="ts">
import { ref, onUpdated, nextTick, onMounted, computed, watch } from 'vue'

const props = defineProps<{
  influencer: {
    id: string;
    title: string;
    slug: string;
    link: string;
    influencerDetails: {
      honorific: string;
      name: string;
      title: string;
      town: string;
      description: string;
      image?: {
        node?: {
          sourceUrl: string;
        };
      };
    };
  };
  isActive: boolean;
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const cardWrapEl = ref<HTMLElement | null>(null);
const cardInnerEl = ref<HTMLElement | null>(null);
const gridWrapEl = ref<HTMLElement | null>(null);
const cardImgEl = ref<HTMLElement | null>(null);

let hoverSet = false;

async function setup() {
  if (hoverSet) return
  hoverSet = true
  await nextTick()
  if (cardWrapEl.value) {
    const title = cardWrapEl.value.querySelector('.details-title')
    const town = cardWrapEl.value.querySelector('.details-town')
    const detailsBG = cardWrapEl.value.querySelector('.details-bg')
    const detailsWrap = cardWrapEl.value.querySelector('.details-wrap')

    cardWrapEl.value.addEventListener('pointerenter', () => {
      cardWrapEl.value?.classList.add('hover')
      title?.classList.add('shown')
      town?.classList.remove('shown')
      detailsBG?.classList.add('hover')
      detailsWrap?.classList.add('hover')
    })
    cardWrapEl.value.addEventListener('pointerleave', () => {
      cardWrapEl.value?.classList.remove('hover')
      title?.classList.remove('shown')
      town?.classList.add('shown')
      detailsBG?.classList.remove('hover')
      detailsWrap?.classList.remove('hover')
    })
  }

  await aniSize();
}

let imgSet = false;

async function aniSize() {
  if(gridWrapEl.value && cardInnerEl.value) {
    await nextTick();
    const gridWrapH = gridWrapEl.value.offsetHeight;
    const gridWrapW = gridWrapEl.value.offsetWidth;

    console.log(gridWrapW, gridWrapH)
    cardInnerEl.value.style.height = `${gridWrapH}px`;
    cardInnerEl.value.style.width = `${gridWrapW}px`;
    if(!imgSet && cardImgEl.value) {
      cardImgEl.value.style.height = `${gridWrapH}px`;
      cardImgEl.value.style.width = `${gridWrapW}px`;
      imgSet = true;
    }
  }
}

function resizeAdjust() {
  if(!cardImgEl.value || !cardInnerEl.value || !cardWrapEl.value || !gridWrapEl.value) {
    return;


  }


  const rect = gridWrapEl.value.getBoundingClientRect();

  const gridWrapH = Math.floor(rect.height);
  const gridWrapW = Math.floor(rect.width);



  if(!props.isActive) {
    cardImgEl.value.style.height = `${gridWrapH}px`;
    cardImgEl.value.style.width = `${gridWrapW}px`;
  }

  cardInnerEl.value.style.height = `${gridWrapH}px`;
  cardInnerEl.value.style.width = `${gridWrapW}px`;


}

onMounted(async () => {
  await setup();
  await aniSize();

  window.addEventListener('resize', resizeAdjust)
})


watch(
    () => props.isActive,
    async () => {
      await aniSize();

    }
)

</script>

<style scoped>

.influencer-card {
  width: 100%;
  height: 100%;
  grid-column: span 1;
  grid-row: span 1;
  position: relative;
  overflow: visible;
}

.influencer-card--active {
  grid-column: span 2;
  grid-row: span 2;
  z-index: 1;
  box-shadow: 0 10px 40px rgba(0,0,0,.25);
}

.card-inner {
  will-change: width, height;
  transition:
      width 420ms cubic-bezier(0.16, 1, 0.3, 1),
      height 420ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top center;
  position: absolute;
  left: 0;
  top: 0;
}

.influencer-card--active .card-wrap::after,
.influencer-card--active .details-bg,
.influencer-card--active .details-wrap {
  opacity: 0 !important;
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
  transform: translateY(100px);
  opacity: 0;
  will-change: transform;
}

.card-wrap.hover::after {
  transform: translateY(15px) !important;
  opacity: 1;
}

.influencer-card--active .card-wrap {
  display: flow-root;
  overflow: visible;
}

.card-wrap {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.headshot {
  object-fit: cover;
  object-position: center top;
  justify-self: flex-end;
  float: right;
  margin-left: .75rem;
  margin-bottom: .25rem;
}

.details-bg {
  position: absolute;
  width: 125%;
  aspect-ratio: 1.125 / 1;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1125 1000'><ellipse cx='562.5' cy='500' rx='562.5' ry='500' fill='white'/></svg>");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center top;
  left: -3%;
  bottom: 35%;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  z-index: 1;
  transition: transform .75s ease, opacity .35s;
  will-change: transform;
}

.details-bg.hover {
  transform: translateY(85%) !important;
}


.details-name {
  color: var(--color-cetacean);
  max-width: 90%;
  font-size: 26px;
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
  transform: translateY(-15px);
  transition: transform .75s ease, opacity .35s;
  text-align: end;
  will-change: transform;
}

.details-wrap.hover {
  transform: translateY(-125px);
}

.description-text {
  display: none;
  opacity: 0;
  animation: fade-text .25s .3s forwards;
}

.influencer-card--active .description-text {
  display: block;
  padding: 1rem;
  opacity: 0;
}

.details-name-active {
  font-size: 28px;
  display: none;
  opacity: 0;
  color: var(--color-cetacean);
  animation: fade-text .25s .3s forwards;
}

@keyframes fade-text {
  from { opacity: 0 }
  to { opacity: 1 }

}


.influencer-card--active .details-name-active {
  display: block;

}

</style>
