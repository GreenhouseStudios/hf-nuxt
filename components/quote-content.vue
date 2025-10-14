<template>
  <div
      class="flex flex-col gap-2 py-4 text-center align-middle  justify-center rounded-2xl bg-cetacean w-full text-white feature-content grow h-121 relative overflow-visible"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
  >

    <p
        ref="taglineEl"
        class="italic w-full text-lg md:text-2xl absolute"
    >
      {{ props.post?.cardOptions?.quoteTagline || 'HARTFORD FOUNDATION' }}
    </p>
    <div
        ref="backEl"
        class="quote-back"
   >
      <div class="quote-icon-box" ref="boxEl">
        <div class="quote-icon" ref="iconEl">
          <p class="quote-text text-2xl font-bold">
            {{ props.post?.cardOptions?.cardDescription || loremFragment }}
          </p>
        </div>
      </div>


      <!-- keep the video link as a separate action if you want -->
      <a class="quote-link" aria-label="Open video" target="_blank"
        :href="props.post?.cardOptions?.quoteLink ?? '#'"
      ></a>
    </div>



  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import anime from 'animejs'

type Post = any
const props = defineProps<{ post: Post }>()

const taglineEl = ref<HTMLElement | null>(null)
const backEl = ref<HTMLElement | null>(null)
const iconEl = ref<HTMLElement | null>(null);
const boxEl = ref<HTMLElement | null>(null);

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
  const maxX = 50;
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

function fadeLinkIn(el: HTMLElement) {
  return anime({
    targets: el,
    opacity: 1,
    easing: 'cubicBezier(.22,.61,.36,1)',
    duration: 800,
  }).finished
}

function fadeLinkOut(el: HTMLElement) {
  return anime({
    targets: el,
    opacity: 0,
    easing: "easeOutQuad",
    duration: 1000
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
  if (!taglineEl.value || !backEl.value) return;

  // OUT: author should already be jumbled & visible
  primeJumbled(taglineEl.value);

  // IN: quote starts dissolved (invisible, scattered)

  await Promise.all([
    dissolveOut(taglineEl.value),
    fadeLinkIn(backEl.value)
  ]);
}

async function onLeave() {
  if (!taglineEl.value || !backEl.value) return;

  // OUT: quote jumbled & visible, then dissolve out

  // IN: author dissolved, then assemble in
  primeDissolved(taglineEl.value);


  await Promise.all([
    assembleIn(taglineEl.value).then(() => cleanupAssembled(taglineEl.value as HTMLElement)),
    fadeLinkOut(backEl.value)
  ]);
  shimmer(taglineEl.value);
}

function quoteTextHover() {
  if(!iconEl.value) return;

  const icon = iconEl.value;
  icon.classList.add('is-open');
  icon.addEventListener('transitionend', (e) => {
    if(e.propertyName !== 'transform') return;
    fadeQuoteText()
  }, {once:true})

}

function quoteTextLeave() {
  if(!iconEl.value) return;
  const icon = iconEl.value;
  icon.classList.remove('is-open');
  const text = icon.querySelector('p');
  if(!text) return;
  text.classList.remove('open');
}


function fadeQuoteText() {
  if(!iconEl.value || !iconEl.value.classList.contains('is-open')) return;

  const text = iconEl.value.querySelector('p');
  if(!text) return;
  text.innerHTML = '';
  let delay = .25
  text.classList.add('open')
  const quoteWords = (props.post?.cardOptions?.cardDescription || loremFragment).trim().split(' ');
  quoteWords.forEach((word: string, wordIdx: number) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('quote-word');

    [...word].forEach(char => {
      const charSpan = document.createElement('span');
      charSpan.classList.add('quote-char');
      charSpan.textContent = char;
      delay += .02;
      charSpan.style.animationDelay = `${delay}s`;
      wordSpan.appendChild(charSpan);
    })
    text.appendChild(wordSpan);
    text.appendChild(document.createTextNode(' '));

  })
}



onMounted(() => {
  if(taglineEl.value) wrapChars(taglineEl.value)

  if (taglineEl.value) {
    primeDissolved(taglineEl.value)
    assembleIn(taglineEl.value)
  }

  if(backEl.value) {
    fadeLinkOut(backEl.value)
  }

  if(iconEl.value) {
    iconEl.value.addEventListener('mouseenter', quoteTextHover);
    iconEl.value.addEventListener('mouseleave', quoteTextLeave);
  }


})
</script>

<style scoped>
/* optional: nicer font rendering for tiny blur steps */
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

.quote-link {
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 79.18 66.44' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10'><path d='M48.84,55.43H3.26c-1.39,0-2.51-1.12-2.51-2.51V3.26C.75,1.87,1.87.75,3.26.75h66.1c1.39,0,2.51,1.12,2.51,2.51v34.17'/><path d='M44.89,30.07l-16.01-9.25c-.76-.44-1.71.11-1.71.99v18.49c0,.88.95,1.43,1.71.99l16.01-9.25c.76-.44.76-1.54,0-1.98Z'/><line x1='.72' y1='13.19' x2='71.87' y2='13.19'/><line x1='5.09' y1='7.03' x2='46.87' y2='7.03'/><circle cx='54.57' cy='7.03' r='2.11'/><circle cx='64.39' cy='7.03' r='2.11'/><line x1='5.09' y1='48.92' x2='47.72' y2='48.92'/><rect x='23.59' y='44.9' width='2.81' height='8.04' rx='1.4' ry='1.4'/><circle cx='63.02' cy='50.28' r='15.4'/><path d='M71.27,46.16l-4.23-3.63c-.62-.53-1.65-.14-1.65.63v1.18c-15.98,1.68-9.25,16-9.25,16,3.53-11.8,9.25-11.48,9.25-11.48v1.55c0,.77,1.03,1.17,1.65.63l4.23-3.63c.4-.35.4-.92,0-1.27Z'/></svg>") no-repeat center;
  background-size: contain;
  height: 80px;
  width: 100px;
  display: inline-block;
  transition: background .5s ease;
}
.quote-link:hover {
  transition: background .5s ease;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 79.18 66.44' fill='%23fff' stroke='%23000a5d' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10'><path d='M48.84,55.43H3.26c-1.39,0-2.51-1.12-2.51-2.51V3.26C.75,1.87,1.87.75,3.26.75h66.1c1.39,0,2.51,1.12,2.51,2.51v34.17'/><path d='M44.89,30.07l-16.01-9.25c-.76-.44-1.71.11-1.71.99v18.49c0,.88.95,1.43,1.71.99l16.01-9.25c.76-.44.76-1.54,0-1.98Z'/><line x1='.72' y1='13.19' x2='71.87' y2='13.19'/><line x1='5.09' y1='7.03' x2='46.87' y2='7.03'/><circle cx='54.57' cy='7.03' r='2.11'/><circle cx='64.39' cy='7.03' r='2.11'/><line x1='5.09' y1='48.92' x2='47.72' y2='48.92'/><rect x='23.59' y='44.9' width='2.81' height='8.04' rx='1.4' ry='1.4'/><circle cx='63.02' cy='50.28' r='15.4'/><path d='M71.27,46.16l-4.23-3.63c-.62-.53-1.65-.14-1.65.63v1.18c-15.98,1.68-9.25,16-9.25,16,3.53-11.8,9.25-11.48,9.25-11.48v1.55c0,.77,1.03,1.17,1.65.63l4.23-3.63c.4-.35.4-.92,0-1.27Z'/></svg>") no-repeat center;
  background-size: contain;
}



.quote-textbox-full {
  position: absolute;
  background: white;
}

.feature-content,
.bg-cetacean,
.quote-back { overflow: visible; }

/* the back container */
.quote-back {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-evenly;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

/* bubble starts as a small circular icon */

.quote-icon-box {
  width: 100px;
  height: 75px;
  position: relative;
  z-index: 999;

}

.quote-icon {
  --qi-origin: bottom right;
  --qi-tail-angle: 225deg;
  --qi-left: auto;
  --qi-right: 0;
  --qi-border-radius: 15px 15px 0 15px;
  --qi-scale: .25;
  position: absolute;
  display: inline-grid;
  place-items: center;
  width: 500px;
  padding: 15px;
  border-radius: var(--qi-border-radius);
  background: #ffffff;
  box-shadow: 0px 3px 15px 0px #00000038;
  color: #0a3460;
  overflow: visible;
  left: var(--qi-left);
  right: var(--qi-right);
  bottom: 0;
  z-index: 999;
  transition: transform .75s ease-in;
  transform: translateY(0) scale(.2);
  will-change: transform;
  transform-origin: var(--qi-origin);
}



.quote-icon::after {
  content: '';
  width: 75px;
  height: 75px;
  background: linear-gradient(var(--qi-tail-angle), #ffffff 0%, #ffffff 50%, #00000012 51%, transparent 100% 100%);
  position: absolute;
  z-index: 2;
  left: var(--qi-left);
  right: var(--qi-right);
  border-bottom-left-radius: 2px;
  bottom: -72px;
}

.quote-text {
  position: relative;
  opacity: 0;
  transition: opacity .25s;
}

.quote-text.open {
  opacity: 1;
}

.quote-textbox {
  visibility: hidden;
}


@keyframes fade-in {
  to {opacity: 1}
}


/* open-state visuals (size is driven by content) */
.quote-icon.is-open {
  background: #FFFFFF;
  transform: translateY(-60px) scale(1) !important;
}


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
