<template>
  <div
      class="wrap flex flex-col gap-2 py-4 text-center align-middle justify-center rounded-2xl w-full text-white feature-content grow h-121 relative overflow-hidden"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @pointerdown="onWrapDown"
      ref="wrapEl"
  >
    <div
      class="quote-front"
      ref="frontEl"
      :class="{ visible: !isBackVisible}"
    >
      <h2
          ref="taglineEl"
          class="w-10/12 text-4xl md:text-5xl absolute font-bold m-auto"
      >
        {{ props.post?.eventOptions?.tagline || 'HARTFORD FOUNDATION' }}
      </h2>
      <svg class="play-icon-front" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.1281 19.8644L14.7315 28.7537L14.7315 10.9752L30.1281 19.8644Z" fill="white"/>
        <circle cx="20" cy="20" r="19.5" stroke="white"/>
      </svg>


    </div>


    <div
      class="quote-back"
      ref="backEl"
      :class="{ visible: isBackVisible }"
    >
      <div class="icons-list" data-interactive>
        <svg class="icon restart" width="27" height="29" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg" ref="restartEl">
          <path d="M8.02678 10.1855C10.0909 7.65576 12.754 6.4576 16.6078 7.18979C18.7668 7.81066 20.6356 9.17724 21.8817 11.0464C23.1279 12.9157 23.6706 15.1663 23.4133 17.398C23.1559 19.6298 22.1153 21.6979 20.4766 23.2345C18.8378 24.7711 16.707 25.6765 14.4634 25.7898C12.2197 25.9031 10.0086 25.2168 8.22341 23.853C6.4382 22.4893 5.60011 20.4746 5.11936 18.2802C4.85827 17.0884 4.93896 16.117 5.23564 15.1602" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M7.79101 4.49925C7.33158 4.46186 6.92893 4.80391 6.89155 5.26333L6.42226 11.0195C6.38487 11.479 6.72776 11.8826 7.18718 11.92L12.3619 11.7028C12.8213 11.7402 13.2239 11.3981 13.2613 10.9387C13.2987 10.4793 12.9567 10.0766 12.4973 10.0393L8.37315 10.341L8.17221 10.1045L8.55509 5.39871C8.59247 4.93929 8.25043 4.53664 7.79101 4.49925Z" fill="white"/>
        </svg>

        <div class="icon-wrap play-pause" style="margin-left: -2px">
          <svg class="icon pause toggled" width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg" ref="pauseEl">
            <rect width="3.21154" height="20.875" fill="white"/>
            <rect x="9.63464" width="3.21154" height="20.875" fill="white"/>
          </svg>

          <svg class="icon play secondary" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" ref="playEl">
            <path d="M17.25 9.95929L9.69333e-07 19.9186L1.84e-06 -3.61504e-06L17.25 9.95929Z" fill="white"/>
          </svg>

        </div>
        <div class="icon-wrap mute-unmute">
          <svg class="icon unmuted toggled" width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg" ref="unMuteEl">
            <path d="M1.23179 4.98508C0.55151 4.98508 3.05176e-05 5.53656 3.05176e-05 6.21684L3.05176e-05 11.1188C3.05176e-05 11.7991 0.55151 12.3506 1.23179 12.3506L6.1338 12.3506C6.81408 12.3506 7.36556 11.7991 7.36556 11.1188L7.36556 6.21684C7.36556 5.53656 6.81408 4.98508 6.13379 4.98508L1.23179 4.98508Z" fill="white"/>
            <path d="M1.05573 7.60149C0.234557 8.07559 0.234555 9.26086 1.05573 9.73496L13.9329 17.1696C14.7541 17.6437 15.7805 17.0511 15.7805 16.1028L15.7805 1.2336C15.7805 0.285392 14.7541 -0.307244 13.9329 0.166862L1.05573 7.60149Z" fill="white"/>
            <path d="M17.2317 13.0401C19.3924 13.0401 21.1442 11.2883 21.1442 9.12757C21.1441 6.96688 19.3924 5.21528 17.2317 5.21528L17.2317 6.20069C18.8481 6.20069 20.1587 7.5111 20.1588 9.12757C20.1588 10.7189 18.8889 12.0137 17.3072 12.0537L17.2317 12.0547L17.2317 13.0401Z" fill="white"/>
            <path d="M18.0206 15.2422C21.3978 15.2421 24.1357 12.5043 24.1357 9.12716C24.1355 5.75007 21.3975 3.01261 18.0204 3.01261L18.0204 3.99778L18.0206 3.99778C20.8535 3.99782 23.1501 6.29432 23.1502 9.12716C23.1502 11.9601 20.8533 14.257 18.0204 14.257L18.0204 15.2422L18.0206 15.2422Z" fill="white"/>
          </svg>
          <svg class="icon muted secondary" width="25" height="18" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg" ref="muteEl">
            <path d="M1.32991 5.38312C0.595423 5.38312 -2.60268e-08 5.97854 -5.81324e-08 6.71303L-2.8948e-07 12.0056C-3.21585e-07 12.7401 0.595423 13.3356 1.32991 13.3356L6.62253 13.3356C7.35702 13.3356 7.95244 12.7401 7.95244 12.0056L7.95244 6.71303C7.95244 5.97854 7.35702 5.38312 6.62253 5.38312L1.32991 5.38312Z" fill="white"/>
            <path d="M19.1717 8.64911C18.7795 8.64911 18.4616 8.967 18.4616 9.35915V9.35915C18.4616 9.75129 18.7795 10.0692 19.1717 10.0692L23.2899 10.0692C23.682 10.0692 23.9999 9.75129 23.9999 9.35915V9.35915C23.9999 8.967 23.6821 8.64911 23.2899 8.64911L19.1717 8.64911Z" fill="white"/>
            <path d="M1.14082 8.20742C0.254209 8.7193 0.254206 9.99901 1.14082 10.5109L15.0441 18.5379C15.9307 19.0498 17.0389 18.41 17.0389 17.3862L17.0389 1.33212C17.0389 0.308347 15.9307 -0.331512 15.0441 0.180373L1.14082 8.20742Z" fill="white"/>
          </svg>

        </div>
        <svg class="icon transcript" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" ref="transcriptEl">
          <path d="M18 0C19.6569 0 21 1.34315 21 3V18C21 19.6568 19.6568 21 18 21H3C1.34317 21 3.4758e-05 19.6568 0 18V3C0 1.34315 1.34315 0 3 0H18ZM4.02148 14.8213C3.5087 14.8215 3.09277 15.2372 3.09277 15.75C3.09286 16.2627 3.50876 16.6785 4.02148 16.6787H12.6123C13.1252 16.6787 13.5409 16.2629 13.541 15.75C13.541 15.2371 13.1252 14.8213 12.6123 14.8213H4.02148ZM4.01953 11.1172C3.50786 11.1172 3.09277 11.5323 3.09277 12.0439C3.093 12.5554 3.508 12.9697 4.01953 12.9697H16.9902C17.5018 12.9697 17.9168 12.5554 17.917 12.0439C17.917 11.5323 17.5019 11.1172 16.9902 11.1172H4.01953ZM4.01953 7.41113C3.50786 7.41115 3.09277 7.82621 3.09277 8.33789C3.09289 8.84947 3.50793 9.26463 4.01953 9.26465H16.9902C17.5018 9.26465 17.9169 8.84948 17.917 8.33789C17.917 7.8262 17.5019 7.41113 16.9902 7.41113H4.01953ZM4.01953 3.70508C3.50786 3.70509 3.09277 4.12016 3.09277 4.63184C3.09283 5.14347 3.50789 5.55858 4.01953 5.55859H16.9902C17.5019 5.55859 17.9169 5.14347 17.917 4.63184C17.917 4.12015 17.5019 3.70508 16.9902 3.70508H4.01953Z" fill="white"/>
        </svg>

      </div>
      <svg class="icon transcript-loading" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="loading" ref="transcriptLoadingEl" data-interactive>
        <path d="M18 0C19.6569 0 21 1.34315 21 3V18C21 19.6568 19.6568 21 18 21H3C1.34317 21 3.4758e-05 19.6568 0 18V3C0 1.34315 1.34315 0 3 0H18ZM4.02148 14.8213C3.5087 14.8215 3.09277 15.2372 3.09277 15.75C3.09286 16.2627 3.50876 16.6785 4.02148 16.6787H12.6123C13.1252 16.6787 13.5409 16.2629 13.541 15.75C13.541 15.2371 13.1252 14.8213 12.6123 14.8213H4.02148ZM4.01953 11.1172C3.50786 11.1172 3.09277 11.5323 3.09277 12.0439C3.093 12.5554 3.508 12.9697 4.01953 12.9697H16.9902C17.5018 12.9697 17.9168 12.5554 17.917 12.0439C17.917 11.5323 17.5019 11.1172 16.9902 11.1172H4.01953ZM4.01953 7.41113C3.50786 7.41115 3.09277 7.82621 3.09277 8.33789C3.09289 8.84947 3.50793 9.26463 4.01953 9.26465H16.9902C17.5018 9.26465 17.9169 8.84948 17.917 8.33789C17.917 7.8262 17.5019 7.41113 16.9902 7.41113H4.01953ZM4.01953 3.70508C3.50786 3.70509 3.09277 4.12016 3.09277 4.63184C3.09283 5.14347 3.50789 5.55858 4.01953 5.55859H16.9902C17.5019 5.55859 17.9169 5.14347 17.917 4.63184C17.917 4.12015 17.5019 3.70508 16.9902 3.70508H4.01953Z" fill="white"/>
      </svg>
      <div class="spinner-bg" v-if="loading" ref="spinnerBgEl">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="spinner"><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="#FFFFFF"/></svg>
      </div>
      <div :class="['transcript-wrap']" ref="transcriptWrapEl">
        <p class="text-1xl lg:text-2xl">
          {{ props.post?.eventOptions?.quote + ' - ' +
            props.post?.eventOptions?.speaker + ', ' +
            props.post?.eventOptions?.speakerTitle
            || "No transcript for this video."}}
        </p>
      </div>
      <video
          ref="vidEl"
          class="quote-vid visible"
          style="opacity: 0"
          :src="props.post?.eventOptions?.videoLink || ''"
          preload="metadata"
      >
      </video>
    </div>




  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from '@/stores/store';
import anime from 'animejs'
const temp = true
type Post = any
const props = defineProps<{ post: Post }>()
const taglineEl = ref<HTMLElement | null>(null)
const vidEl = ref<HTMLVideoElement | null>(null);
const backEl = ref<HTMLElement | null>(null);
const frontEl = ref<HTMLElement | null>(null);

const store = useStore();
const loading = ref(true)
const shouldPlay = ref(false);

const isBackVisible = ref(false);

const wrapEl = ref<HTMLElement | null>(null);
const transcriptWrapEl = ref<HTMLElement | null>(null);
const loremFragment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`

const restartEl = ref<HTMLElement | null>(null);
const playEl = ref<HTMLElement | null>(null);
const pauseEl = ref<HTMLElement | null>(null);
const muteEl = ref<HTMLElement | null>(null);
const unMuteEl = ref<HTMLElement | null>(null);
const transcriptEl = ref<HTMLElement | null>(null);

const transcriptLoadingEl = ref<HTMLElement | null>(null);
const spinnerBgEl = ref<HTMLElement | null>(null);

function wrapCharsByWord(el: HTMLElement) {
  const text = el.textContent ?? '';
  el.textContent = '';

  const frag = document.createDocumentFragment();

  // Split into words + whitespace tokens, keeping spaces
  const tokens = text.split(/(\s+)/);

  for (const token of tokens) {
    // Just spaces/newlines → keep as normal text so browser can wrap
    if (/^\s+$/.test(token)) {
      frag.appendChild(document.createTextNode(token));
      continue;
    }

    // Word span
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.style.display = 'inline-block';

    // Char spans inside it
    for (const ch of token) {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.style.display = 'inline-block';
      charSpan.style.willChange = 'transform, opacity, filter';
      charSpan.textContent = ch;
      wordSpan.appendChild(charSpan);
    }

    frag.appendChild(wordSpan);
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

/** subtle shimmer on the assembled layer */
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

function showBack() {
  if(isBackVisible.value) return;
  isBackVisible.value = true;
}

function showFront() {
  if(!isBackVisible.value) return;
  isBackVisible.value = false;
}


async function onEnter() {
  if (!taglineEl.value || !backEl.value || !wrapEl.value || !vidEl.value || !frontEl.value) return;

  shouldPlay.value = true;
  // OUT: author should already be jumbled & visible
  primeJumbled(taglineEl.value);


  showBack();
  await Promise.all([
    dissolveOut(taglineEl.value),
  ]);
}

async function onLeave() {
  if (!taglineEl.value || !backEl.value || !wrapEl.value || !vidEl.value || !frontEl.value) return;
  shouldPlay.value = false;

  primeDissolved(taglineEl.value);

  showFront();
  await Promise.all([
    assembleIn(taglineEl.value).then(() => cleanupAssembled(taglineEl.value as HTMLElement)),
  ]);
  shimmer(taglineEl.value);
}


function startedOnInteractive(e: PointerEvent) {
  const t = e.target as HTMLElement | null;
  return !!t?.closest('[data-interactive]');
}

function onWrapDown(e: PointerEvent) {
  if (startedOnInteractive(e)) return;

  if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;

  if (isBackVisible.value) onLeave()
  else onEnter();
}
const playPause = (el: HTMLElement) => {
  if(vidEl.value) {


    shouldPlay.value = !shouldPlay.value;
    Array.from(el.children).forEach(icon => {
      icon.classList.toggle('toggled');
    })
  }
}

const muteUnmute = () => {
  store.toggleQuotesMuted();
}


const restartVideo = () => { if(vidEl.value) vidEl.value.currentTime = 0; }

const toggleTranscript = () => {
  if (!vidEl.value || !transcriptWrapEl.value) return;
  if(loading.value) {
    transcriptWrapEl.value.classList.toggle('loading');
    if(spinnerBgEl.value) {
      spinnerBgEl.value.classList.toggle('down');
    }
    return;
  } else {
    vidEl.value.classList.toggle('visible');
    transcriptWrapEl.value.classList.toggle('visible');
    vidEl.value.currentTime = 0;

    if (shouldPlay.value) {
      shouldPlay.value = false;
      if (pauseEl.value && playEl.value) {
        pauseEl.value.classList.toggle('toggled');
        playEl.value.classList.toggle('toggled');
      }
    }
  }

}

onMounted(() => {
  if(taglineEl.value) wrapCharsByWord(taglineEl.value)

  if (taglineEl.value) {
    primeDissolved(taglineEl.value)
    assembleIn(taglineEl.value)
  }

  if(frontEl.value && backEl.value) {

  }

    if(!backEl.value) return;
    const playPauseEl = backEl?.value.querySelector('.play-pause');
    const muteUnmuteEl = backEl?.value.querySelector('.mute-unmute');
    const transcriptEl = backEl?.value.querySelector('.transcript');

    if(restartEl.value) {
      restartEl.value.addEventListener('pointerdown', restartVideo);
    }

    playPauseEl?.addEventListener('pointerdown', () => {
      playPause(playPauseEl as HTMLElement);
    })

    muteUnmuteEl?.addEventListener('pointerdown', () => {
      muteUnmute();
    })
    transcriptEl?.addEventListener('pointerdown', toggleTranscript);

    if(vidEl.value) {
      vidEl.value.addEventListener('loadstart', () => {
        loading.value = true;
      })

      vidEl.value.addEventListener('waiting', () => {
        loading.value = true;
      })

      vidEl.value.addEventListener('canplay', () => {
        loading.value = false;
      })
    }

    if(transcriptLoadingEl.value && loading) {
      transcriptLoadingEl.value.addEventListener('pointerdown', () => {
        if(spinnerBgEl.value && transcriptWrapEl.value) {
          toggleTranscript();
        }
      })
    }
})

watch(
  () => store.quotesMuted,
  (muted) => {
    if(vidEl.value && muteEl.value && unMuteEl.value) {
      muteEl.value.classList.toggle('toggled')
      unMuteEl.value.classList.toggle('toggled');
      vidEl.value.muted = muted;
    }
  }
)

watch([loading, shouldPlay], ([isLoading, wants]) => {
  if(!vidEl.value) return;

  if(!isLoading && wants) {
    vidEl.value.play();
  }

  if(!wants) {
    vidEl.value.pause();
  }

})

</script>

<style scoped>
.char { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

/* Keep the actual space glyph width; allow wrapping between spans */
.char {
  display: inline-block;
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

.wrap {
  transition: background-color .75s ease;
  background-color: #000A5D;
  position: relative;
}

.quote-front {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: opacity .75s ease;
  opacity: 0;
}

.quote-front:after {
  content: '';
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(70deg, #007AFD 0%,#003267 100%);
  clip-path: polygon(0 0, 29% 0, 63% 100%, 0 101%, 0 57%);
  opacity: .3;
}

.quote-front > h2 {
  z-index: 2;
}

.play-icon-front {
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 12px;
  right: 12px;
  z-index: 2;
}

.quote-front.visible, .quote-back.visible { opacity: 1 !important; }

/* the back container */
.quote-back {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-evenly;
  justify-content: space-around;
  transition: opacity .75s ease;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.spinner-bg {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: #000A5D;
  z-index: 4;
  pointer-events: none;
  padding-bottom: 15px;
}

.spinner-bg.down {
  align-items: end;
}

.spinner-bg:after {
  content: '';
  position: absolute;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(70deg, #007AFD 0%,#003267 100%);
  clip-path: polygon(0 0, 29% 0, 63% 100%, 0 101%, 0 57%);
  opacity: .3;
}

.spinner {
  height: 50px;
  width: 50px;
  transform-origin:center;
  animation:spinner .75s infinite linear;
  pointer-events: none;
}

@keyframes spinner {
  100%{transform: rotate(360deg)}
}

.transcript-loading {
  bottom: 14px;
  right: 15px;
  position: absolute;
  z-index: 5;
}

.transcript-wrap.loading {
  z-index: 4;
}

.quote-vid {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  opacity: 0;
  transition: opacity .75s ease;
  pointer-events: none;
}

.quote-vid.visible {
  opacity: 1 !important;
}


.icons-list {
  position: absolute;
  bottom: 10px;
  right: 15px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 18px;
  z-index: 3;
}

.icon-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.icon.secondary {
  position: absolute;
  left: 0;
  top: 0;
}

.icon {
  pointer-events: all;
  transition: opacity .15s;
}
.icon path, .icon rect {
  transition: stroke .15s, fill .25s;
}

.icon:hover {
  cursor: pointer;
}

.icon:not(.restart):hover path, .icon.restart:hover path:last-child {
  fill: darkgrey;
}

.icon:hover rect {
  fill: darkgrey;
}

.icon.restart:hover path:first-child {
  stroke: darkgrey;
}

.icon-wrap > .icon {
  opacity: 0;
  pointer-events: none;
  cursor: pointer;
}

.icon.toggled {
  opacity: 1 !important;
  pointer-events: all !important;
}

.restart {
  transform: translateY(-1px);
}
.transcript-wrap {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.transcript-wrap > p {
  text-align: left;
  padding: 1rem;
}

.transcript-wrap.visible {pointer-events: all !important;}

</style>
