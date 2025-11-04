<template>
  <div
      class="wrap flex flex-col gap-2 py-4 text-center align-middle justify-center rounded-2xl bg-cetacean w-full text-white feature-content grow h-121 relative overflow-hidden"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      ref="wrapEl"
  >

    <h2
        ref="taglineEl"
        class="w-full text-lg md:text-5xl absolute font-bold"
    >
      {{ props.post?.cardOptions?.quoteTagline || 'HARTFORD FOUNDATION' }}
    </h2>
    <video
        ref="backEl"
        class="quote-back"
        :src="props.post?.cardOptions?.quoteLink || ''"
        preload="metadata"

   >








    </video>



  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'

type Post = any
const props = defineProps<{ post: Post }>()

const taglineEl = ref<HTMLElement | null>(null)
const backEl = ref<HTMLVideoElement | null>(null)
const wrapEl = ref<HTMLElement | null>(null);
const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`

function wrapChars(el: HTMLElement) {
  const text = el.textContent ?? '';
  const frag = document.createDocumentFragment();
  el.textContent = '';

  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity, filter';

    span.textContent = ch === ' ' ? '\u00A0' : ch;
    frag.appendChild(span);
  }
  el.appendChild(frag);
}

function killTweens(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char');
  anime.remove(chars);
}

/** starting state for the incoming layer: scattered + invisible */
function primeDissolved(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char');
  killTweens(el);
  chars.forEach((c) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 8 + Math.random() * 18;
    const dx = Math.cos(angle) * radius;
    const dy = -1 * (1 + Math.random() * 3) + Math.sin(angle) * 2;
    const rot = (Math.random() * 12 - 6);
    /*    anime.set(c, {
          translateX: dx,
          translateY: dy,
          rotate: rot,
          scale: 0.98 + Math.random() * 0.04,
          opacity: 0,
        });*/
  });
}

function primeJumbled(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char');
  killTweens(el);
  chars.forEach((c) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 8 + Math.random() * 18;
    const dx = Math.cos(angle) * radius * .1;
    const dy = (2 + Math.random() * 5) + Math.sin(angle) * 6;
    const rot = (Math.random() * 12 - 6);
    // anime.set(c, {
    //   translateX: dx,
    //   translateY: () => {
    //     let neg = Math.random() < .5 ? -1 : 1;
    //     return neg * dy;
    //   },
    //   rotate: rot,
    //   scale: 1,
    //   opacity: 1
    // });
  });
}

function dissolveOut(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char');
  killTweens(el);
  const maxX = 50
  return anime({
    targets: chars,
    translateX: (_el: HTMLElement, i: number, l: number) => {
      const mid = (l - 1) / 2;
      const dir = i <= mid ? -1 : 1;
      const norm = Math.abs(i - mid) / mid;
      return dir * norm * maxX;
    },
    translateY: () => {
      let neg = Math.random() < .5 ? -1 : 1;
      return neg * (-3 - Math.random() * 15);
    },
    rotate: () => (Math.random() * 40 - 20),
    opacity: 0,
    easing: 'easeOutQuad',
    duration: 550,
  }).finished;
}

function assembleIn(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char');
  killTweens(el);
  return anime({
    targets: chars,
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    easing: 'cubicBezier(.22,.61,.36,1)',
    duration: 800,
    delay: anime.stagger(10, { from: 'center' }),
  }).finished;
}

function cleanupAssembled(el: HTMLElement) {
  if(!el || !el.isConnected) return;
  el.style.opacity = '1';
  el.querySelectorAll<HTMLElement>('.char').forEach(c => {
    c.style.transform = '';
    c.style.opacity = '';
  });
}

/** subtle shimmer on the assembled layer (optional flourish) */
function shimmer(el: HTMLElement) {
  const chars = el.querySelectorAll<HTMLElement>('.char')
  anime({
    targets: chars,
    translateY: [
      { value: -1, duration: 320, easing: 'easeOutSine' },
      { value: 0,  duration: 350, easing: 'easeInSine' }
    ],
    opacity: [
      { value: 0.96, duration: 320, easing: 'linear' },
      { value: 1.00, duration: 350, easing: 'linear' }
    ],
    delay: anime.stagger(8, { from: 'center' })
  })
}


async function onEnter() {
  if (!taglineEl.value || !backEl.value || !wrapEl.value) return;

  // OUT: author should already be jumbled & visible
  primeJumbled(taglineEl.value);

  // IN: quote starts dissolved (invisible, scattered)
  backEl.value.addEventListener('transitionstart', () => {
    backEl.value?.play()
  }, {once:true})
  backEl.value.classList.toggle('visible');
  wrapEl.value.classList.toggle('bg-cetacean');

  await Promise.all([
    dissolveOut(taglineEl.value),
  ]);
}

async function onLeave() {
  if (!taglineEl.value || !backEl.value || !wrapEl.value) return;

  // OUT: quote jumbled & visible, then dissolve out

  // IN: author dissolved, then assemble in
  primeDissolved(taglineEl.value);
  backEl.value.addEventListener('transitionstart', () => {
    backEl.value?.pause();
  }, {once:true})
  backEl.value.classList.toggle('visible');
  wrapEl.value.classList.toggle('bg-cetacean');

  await Promise.all([
    assembleIn(taglineEl.value).then(() => cleanupAssembled(taglineEl.value as HTMLElement)),
  ]);
  shimmer(taglineEl.value);
}





onMounted(() => {
  if(taglineEl.value) wrapChars(taglineEl.value)

  if (taglineEl.value) {
    primeDissolved(taglineEl.value)
    assembleIn(taglineEl.value)
  }



})
</script>

<style scoped>
.char { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

/* Keep the actual space glyph width; allow wrapping between spans */
.char {
  display: inline-block;
  white-space: pre;
  vertical-align: baseline;
  will-change: filter, transform, opacity;
  transition: transform .25s;
}

/* (Optional) if you want the entire line to wrap naturally even with spans */
p[aria-hidden="false"] {
  white-space: pre-wrap;    /* preserves spaces + allows wrapping */
  word-break: normal;
}

.feature-content,
.bg-cetacean,

.wrap { transition: background-color .75s ease; }

/* the back container */
.quote-back {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-evenly;
  justify-content: space-around;
  transition: opacity 1s ease;
  opacity: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.quote-back.visible { opacity: 1 }

</style>
<style>
.quote-char {
  opacity: 0;
  display: inline-block;
  animation: fade-in 0.2s forwards;
}
.quote-word {
  display: inline-block;
  white-space: nowrap;
  word-break: break-word;
}
</style>
