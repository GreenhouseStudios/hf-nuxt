<script setup lang="ts">
import { computed, onMounted, ref, nextTick, watch, onBeforeUnmount } from 'vue';
import { useStore } from "~/stores/store";

const contentWrap = ref<HTMLElement | null>(null);

const props = defineProps<{
  post: Post | null;
}>();

const store = useStore();
const stablePost = ref<Post | null>(null)

watch(
    () => props.post,
    (p) => { if (p) stablePost.value = p },
    { immediate: true }
)

const html = computed(() => stablePost.value?.eventOptions?.content ?? '')

async function waitForWrap() {
  while(!contentWrap.value) await nextTick()
}
function gcd(a:number, b:number):number { return b ? gcd(b, a % b) : a; }

function decimalToRatio(decimal:number) {
  const d = Math.round(decimal * 100) / 100;
  const top = Math.round(d * 100);
  const bottom = 100;

  const g = gcd(top, bottom);

  return `${top / g}/${bottom / g}`;
}

onMounted(async () => {


  document.addEventListener('pointerdown', onDocPointerDown, true);

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocPointerDown, true);
  })
  await waitForWrap();
  await nextTick();

  if(!contentWrap.value) return;

  let quoteExists = stablePost?.value?.eventOptions?.contentQuote !== null
  let quoteFound = false;


  let quoteID = '{ Quote }';
  let altQuoteID = '{Quote}';

  let quoteWrap: any;

  const pEls = Array.from(contentWrap.value?.querySelectorAll('p'));

  const h2Els = Array.from(contentWrap.value?.querySelectorAll('h2'));

  const h3Els = Array.from(contentWrap.value?.querySelectorAll('h3'));


  if(quoteExists) {
    quoteWrap =
        pEls.find(el => el.textContent === quoteID || el.textContent === altQuoteID) ??
        h2Els.find(el => el.textContent === quoteID || el.textContent === altQuoteID) ??
        h3Els.find(el => el.textContent === quoteID || el.textContent === altQuoteID) ??
        null

    if(quoteWrap) {
      if(pEls.includes(quoteWrap)) { pEls.splice(pEls.indexOf(quoteWrap), 1) }
      else if(h2Els.includes(quoteWrap)) { h2Els.splice(h2Els.indexOf(quoteWrap), 1) }
      else if(h3Els.includes(quoteWrap)) { h3Els.splice(h3Els.indexOf(quoteWrap), 1) }
      quoteFound = true;
    }
  }

  if(quoteFound && quoteWrap) {
    quoteWrap.classList.add('content-quote-wrap', 'my-15')
    quoteWrap.innerHTML = '';

    const quoteText = document.createElement('span');
    quoteText.classList.add('content-quote-text', 'text-2xl', 'font-bold');
    quoteText.textContent =  stablePost?.value?.eventOptions?.contentQuote ?? '"The two most important days in your life are the day you are born and the day you find out why"';

    const quoteSpeaker = document.createElement('span');
    quoteSpeaker.classList.add('content-quote-speaker', 'text-1xl', 'font-semibold')
    quoteSpeaker.textContent = `— ${stablePost?.value?.eventOptions?.quoteSpeaker ?? 'Anonymous'}`;

    const quoteFill = document.createElement('span');
    quoteFill.className = 'content-quote-fill';
    quoteFill.textContent = '”'

    quoteWrap.appendChild(quoteFill);
    quoteWrap.appendChild(quoteText);
    quoteWrap.appendChild(quoteSpeaker)


  }



  const vidLinkEls: HTMLIFrameElement[] = [];

  const imgRows: imgRow[] = [];

  type imgRow = HTMLImageElement[];

  pEls?.forEach(el => {
    if(!el) return;
    const imgs = el.querySelectorAll('img');
    if(imgs.length > 0) {
      const imgEls: imgRow = [];
      el.classList.add('content-img-wrap', 'my-12')
      imgs.forEach(img => {
        imgEls.push(img);
      })
      imgRows.push(imgEls);
      return;
    }
    const vidLink = el.querySelector('iframe');
    if(vidLink) {
      el.classList.add('content-vid-link-wrap');
      try {
        const url = new URL(vidLink.src);
        console.log(url)
        url.searchParams.set('controls', '0');
        url.searchParams.set('modestbranding', '1');
        url.searchParams.set('playsinline', '1');

        vidLink.src = url.toString();
      } catch(e) {
        console.warn('Bad iframe src:', vidLink.src, e);
      }
      vidLinkEls.push(vidLink);

      return;
    }
  })

  imgRows.forEach(row => {
    const count = row.length;
    const width = Math.floor(95 / count);
    if(row.length === 1) {
      const el = row[0];
      const decimal = el.naturalWidth / el.naturalHeight;

      if(decimal >= 2) {
        el.className = 'img-single-wide';
      } else if(decimal >= 1) {
        el.style.aspectRatio = decimalToRatio(decimal);
        el.className = 'img-single-reg';
      } else {
        el.style.aspectRatio = decimalToRatio(decimal);
        el.className = 'img-single-tall';
      }
    } else {
      let ratio = `${decimalToRatio(row[0].naturalWidth / row[0].naturalHeight)}`
      row.forEach(el => {
        el.style.width = `${width}%`;
        el.style.aspectRatio = ratio;
        el.className = 'content-img';
      })
    }

  })

  vidLinkEls.forEach(el => el.className = 'content-vid-link')


  h2Els?.forEach(el => el.classList.add('text-3xl', 'font-bold', 'my-8'))


  h3Els.forEach(el => el.classList.add('text-2xl', 'font-medium', 'my-4', 'subtitle'));

  const gallery = contentWrap.value.querySelector<HTMLElement>('.gallery');

  if(gallery) gallery.classList.add('content-gallery', 'my-10');

  const postFooterWrap = document.createElement('div');
  postFooterWrap.classList.add('post-footer', 'my-5')

  const tagWrap = document.createElement('div');
  tagWrap.classList.add('tag-wrap');

  const tagLabel = document.createElement('span');
  tagLabel.classList.add('tag-label', 'text-1xl', 'font-bold')
  tagLabel.textContent = 'Tags:'
  tagWrap.appendChild(tagLabel)

  const categories: Category[] = [];

  const tagCatWrap = document.createElement('div');
  tagCatWrap.className = 'tag-cat-wrap';

  stablePost?.value?.categories.nodes.forEach(category => {
    const catEl = document.createElement('span');
    catEl.classList.add('tag-item', 'py-3', 'px-5', 'footer-icon')
    catEl.textContent = category.name;
    tagCatWrap.appendChild(catEl);
  });
  tagWrap.appendChild(tagCatWrap)
  postFooterWrap.appendChild(tagWrap);

  const socialWrap = document.createElement('div');
  socialWrap.className = 'social-wrap';
  socialWrap.setAttribute('data-interactive', '');

  const socialIconWrap = document.createElement('div');
  socialIconWrap.className = 'social-icon-wrap';

  const socialLabel = document.createElement('span');
  socialLabel.textContent = 'Share:';
  socialLabel.classList.add('text-1xl', 'font-bold');
  socialWrap.appendChild(socialLabel);

  const socialLinked = document.createElement('a');
  socialLinked.classList.add('social-icon', 'social-linked', 'footer-icon');
  socialLinked.setAttribute('href', 'https://www.linkedin.com/');
  socialLinked.setAttribute('target', '_blank')
  socialIconWrap.appendChild(socialLinked);

  const socialFB = document.createElement('a');
  socialFB.classList.add('social-icon', 'social-fb', 'footer-icon');
  socialFB.setAttribute('href', 'https://www.facebook.com/');
  socialFB.setAttribute('target', '_blank')
  socialIconWrap.appendChild(socialFB)


  const socialYT = document.createElement('a');
  socialYT.classList.add('social-icon', 'social-yt', 'footer-icon');
  socialYT.setAttribute('href', 'https://www.youtube.com/');
  socialYT.setAttribute('target', '_blank')
  socialIconWrap.appendChild(socialYT)

  const socialInst = document.createElement('a');
  socialInst.classList.add('social-icon', 'social-inst', 'footer-icon');
  socialInst.setAttribute('href', 'https://www.instagram.com/');
  socialInst.setAttribute('target', '_blank')
  socialIconWrap.appendChild(socialInst)

  socialWrap.appendChild(socialIconWrap);

  postFooterWrap.appendChild(socialWrap)

  contentWrap.value.appendChild(postFooterWrap);


  function onDocPointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('[data-interactive]')) return;

    if(e.type !== 'pointerdown') return;
    store.closeModal();
  }

function setGallery() {
  if(window.innerWidth < 600) {
    if(gallery) gallery.style.gridTemplateColumns = 'repeat(1, 1fr)';
  } else {
    if(gallery) gallery.style.gridTemplateColumns = '';
  }
}
window.addEventListener('resize', () => {
  setGallery();
})
setGallery()

})

</script>

<template>
  <div class="post-layout">
    <div
        class="hero-wrap"
        ref="heroWrap"
        v-show="stablePost"
        :style="{ backgroundImage: `url(${stablePost?.eventOptions?.thumbnail?.node?.mediaItemUrl ?? '/placeholder.png'})`}"
    >
      <h2 class="text-3xl font-bold p">{{ stablePost?.title || '' }}</h2>
      <p class="pt-3">{{
        stablePost?.eventOptions?.heroText ??
        stablePost?.eventOptions.tagline ??
        ''

        }}</p>

    </div>
    <div
        class="content-wrap"
        ref="contentWrap"
        v-show="stablePost"
        v-html="html"
    ></div>
  </div>
</template>

<style scoped>
.post-layout {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  overflow: auto;
}


.content-wrap {
  color: black;
  background: white;
  padding: 3rem 12% 8rem 12%;
  flex: 1 1 auto;
}


.hero-wrap {
  position: relative;
  padding: 12rem 12% 8rem;
  padding-right: unset;
  background-size: cover;
  background-position: center;
  color: white;
  flex-shrink: 0;
}
.hero-wrap > h2, .hero-wrap > p {
  position: relative;
  z-index: 1;
  max-width: 90%
}

.hero-wrap:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.65);
  z-index: 0;
}
</style>
<style>
.content-img-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: stretch;
}

.content-img {
  width: 45%;
  max-height: 600px;
  object-fit: cover;
  border-radius: calc(var(--ui-radius) * 4);
}

.img-single-wide {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: calc(var(--ui-radius) * 4);
}

.img-single-reg {
  width: 60%;
  margin: auto;
  object-fit: cover;
  border-radius: calc(var(--ui-radius) * 4);
}

.img-single-tall {
  width: 40%;
  margin: auto;
  object-fit: cover;
  border-radius: calc(var(--ui-radius) * 4);
}

@media(max-width: 740px) {
  .img-single-reg {
    width: 80%;
  }
  .img-single-tall {
    width: 60%;
  }
}

.content-vid-link-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5rem auto;
  position: relative;
}
.content-vid-link {
  border-radius: calc(var(--ui-radius) * 4);
  margin: auto;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}
.content-vid-link .ytp-chrome-top {
  display: none !important;
}

.subtitle {
  padding-left: 15px;
  position: relative;
}

.subtitle:after {
  content: '';
  position: absolute;
  height: 100%;
  width: 10px;
  left: 0;
  top: 0;
  background-color: rgba(0, 122, 253, 0.5);
}

.content-quote-wrap {
  display: flex;
  flex-direction: column;
  padding: 4rem 4rem 4rem 13rem;
  background: linear-gradient(90deg, #000A5D 0%, #000A5D 15%, rgba(217, 217, 217, .5) 15%, rgba(217, 217, 217, .5) 100%);
  border-radius: calc(var(--ui-radius) * 4);
  gap: 1rem;
  position: relative;
}





.content-quote-fill {
  position: absolute;
  left: 50px;
  top: 35px;
  height: fit-content;
  color: white;
  font-size: 200px;
}

.content-quote-text, .content-quote-speaker {
  color: #000A5D;

}


.content-gallery {
  display: flex;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: calc(var(--ui-radius) * 4);
  overflow: hidden;
  justify-content: center !important;

}

.content-gallery figure {
  margin-bottom: 0;
  flex: 0 0 calc((100% - 32px) / 3);
  max-width: calc((100% - 32px) / 3);
  margin: .25rem;
}

.content-gallery figure > div, .content-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(var(--ui-radius) * 4);

}

.post-footer {
  display: flex;
  color: black;
  justify-content: space-between;
}

@media(max-width: 1500px) {
  .content-quote-wrap {
    padding: 2rem 2rem 2rem 10rem;
  }
  .content-quote-fill {
    top: 5px;
    left: 30px;
  }
}

@media(max-width: 1200px) {
  .content-quote-wrap {
    padding: 2rem 2rem 2rem 9rem;
  }
  .content-quote-fill {
    top: 10px;
    left: 20px;
  }
  .content-quote-text {
    font-size: 20px;
  }
}

@media(max-width: 900px) {
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .content-quote-wrap {
    padding: 1rem 1rem 1rem 8rem;
  }
  .content-quote-fill {
    left: 10px;
    top: -10px;
  }
}

@media(max-width: 740px) {
  .content-wrap {
    padding-right: 7% !important;
    padding-left: 7% !important;
  }
  .hero-wrap {
    padding-left: 7% !important;
  }
  .social-icon-wrap {
    grid-template-columns: repeat(2, auto) !important;
  }
  .tag-cat-wrap {
    grid-template-columns: repeat(2, auto);
  }
  .content-quote-wrap {
    padding: .75rem .75rem .75rem 6rem;
  }
  .content-quote-fill {
    left: 3px;
  }
}

@media(max-width: 640px) {
  .content-quote-fill {
    visibility: hidden;
  }
  .content-quote-wrap {
    background: rgba(217, 217, 217, .5);
    padding: .75rem;
  }
}

@media(max-width: 500px) {
  .tag-cat-wrap {
    grid-template-columns: repeat(1, auto);
  }
}

.tag-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: .5rem;
  align-items: flex-start;
}

.tag-cat-wrap {
  display: grid;
  grid-template-columns: auto auto auto;
  flex-direction: row;
  gap: 1.25rem;
  flex-wrap: wrap;
}



.tag-item {
  border-radius: 25px;
  width: fit-content;
}

.social-wrap {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: flex-start;
}

.social-icon-wrap {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 1.25rem;
  justify-content: end;
  align-items: center;
}

.footer-icon {
  background-color: rgba(217, 217, 217, .5);
  transition: border-color .3s ease, background-color .3s ease;
  border: 2px solid rgba(0,0,0,0);
}

.footer-icon:hover {
  background-color: white;
  border-color: rgba(0,0,0,0.75);
  cursor: pointer;
}

.social-icon {
  width: 48px;
  height: 48px;
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
  border-radius: 18px;

}



.social-linked {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2716%27%20height%3D%2716%27%20fill%3D%27currentColor%27%20viewBox%3D%270%200%2016%2016%27%3E%3Cpath%20d%3D%27M0%201.146C0%20.513.526%200%201.175%200h13.65C15.474%200%2016%20.513%2016%201.146v13.708c0%20.633-.526%201.146-1.175%201.146H1.175C.526%2016%200%2015.487%200%2014.854zm4.943%2012.248V6.169H2.542v7.225zm-1.2-8.212c.837%200%201.358-.554%201.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4%203.226%202.4%203.934c0%20.694.521%201.248%201.327%201.248zm4.908%208.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878%201.232-.878.869%200%201.216.662%201.216%201.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274%200-1.845.7-2.165%201.193v.025h-.016l.016-.025V6.169h-2.4c.03.678%200%207.225%200%207.225z%27/%3E%3C/svg%3E");
}

.social-fb {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-facebook' viewBox='0 0 16 16'%3E%3Cpath d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951'/%3E%3C/svg%3E");
}

.social-yt {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-youtube' viewBox='0 0 16 16'%3E%3Cpath d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z'/%3E%3C/svg%3E");
}

.social-inst {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-instagram' viewBox='0 0 16 16'%3E%3Cpath d='M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334'/%3E%3C/svg%3E");
}

.gallery-columns-1 { grid-template-columns: repeat(1, 1fr); }
.gallery-columns-2 { grid-template-columns: repeat(2, 1fr); }
.gallery-columns-3 { grid-template-columns: repeat(3, 1fr); }
.gallery-columns-4 { grid-template-columns: repeat(4, 1fr); }


</style>