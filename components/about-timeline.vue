<style scoped>

.about-header {
  position: relative;
}

.section-wrap:after {
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(200deg, transparent 35%, #007afd75 100%);
  position: absolute;
  z-index: -1;
  clip-path: polygon(50% 0%, 100% 0%, 100% 97%, 86% 93%, 69% 90%, 49% 89%, 32% 90%, 15% 93%, 0% 97%, 0% 0%);
}



@media(max-width: 1075px) {
  .section-wrap:after {
    clip-path: polygon(50% 0%, 100% 0%, 100% 97%, 90% 96%, 71% 95%, 50% 95%, 19% 96%, 7% 97%, 0% 98%, 0% 0%);
  }
}

@media(max-width: 550px) {
  .section-wrap:after {
    clip-path: polygon(50% 0%, 100% 0%, 100% 99%, 85% 98%, 70% 98%, 46% 98%, 28% 98%, 15% 98%, 0% 99%, 0% 0%);
  }
}

.half-circle-wrap {
  transform-origin: top right;
  transform: scale(1.1);
  opacity: 0;
}

.half-circle {
  position: relative;
  transform-origin: center;
}

@media(max-width: 1600px) {
  .half-circle-wrap { transform: scale(1) }
}

@media(max-width: 1400px) {
  .half-circle-wrap { transform: scale(.9) }
}

@media(max-width: 1200px) {
  .half-circle-wrap { transform: scale(.9); right: -200px }
}

@media(max-width: 925px) {
  .half-circle-wrap { transform: scale(.45); right: -50px}
  .half-circle { transform: rotate(5deg) }
}

@media(max-width: 600px) {
  .half-circle {
    transform: scale(.35) rotate(30deg);
    transform-origin: top right;
    right: 10px;
    top: 185px;

  }
}
@media(max-width: 450px) {
  .half-circle {
    transform: scale(.35) rotate(45deg);
    transform-origin: top right;
    right: -194px;
    top: 99px;
  }
}

.about-header:after {
  content: "";
  position: absolute;
  height: 95%;
  width: 15px;
  left: -50px;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  transform-origin: bottom;
  background-color: #007AFD;
  animation: head-ani .5s ease-out .75s forwards;
}



@media(max-width: 768px) {
  .about-header:after {
    left: -20px;
    width: 10px;
  }
}

@media(max-width: 640px) {
  .about-header:after {
    left: 3px;
    bottom: -7px;
    width: 85px;
    height: 5px;
    top: auto;
    transform: scaleX(0);
    animation: head-ani-mobile .5s ease-out .75s forwards;
    transform-origin: left;
  }
}
@keyframes head-ani {
  from {transform: translateY(-50%) scaleY(0);}
  to {transform: translateY(-50%) scaleY(1);}
}

@keyframes head-ani-mobile {
  from {transform: scaleX(0)}
  to {transform: none}
}

.slideshow-wrap {
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
  aspect-ratio: 18/10;
}

@media(min-width: 1725px) {
  .slideshow-wrap {
    height: 500px;
  }
}


.slideshow {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(180deg, #94C8FF 0%, #597899 80%);
  border-radius: 22px;
}

.slideshow:after {
  content: "";
  height: calc(100% - 9px);
  width: calc(100% - 9px);
  transform: translateX(-50%) translateY(-50%);
  border-radius: 20px;
  left: 50%;
  top: 50%;
  position: absolute;
  z-index: 1;
  background-color: #000A5D;
}

.slideshow-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 9px);
  height: calc(100% - 9px);
  border-radius: 20px;

  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  z-index: 2;

}

.slideshow-image.active {
  opacity: 1;
}

.spinner-wrap {
  height: 50px;
  width: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 3;

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


.vision-text-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: #000A5D;
}

.vision-text-wrap > p {
  color: #000A5D;
  font-size: large;
}

.arc {
  width: 100vw;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
}


.stat-wrap {
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  color: #000A5D;
}
.stat-line {
  width: 2px;
  background: #000A5D;
}

.stat-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  will-change: transform, opacity;
  opacity: 0;
  transform: translateY(100px);
  transition: transform .5s, opacity .15s;
  width: 200px;
}

.stat-text.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-text > span {
  font-weight: bolder;
  font-size: large;
}
.stat-text > h2 {
  font-size: 4.5rem;
  font-weight: bolder;
  margin-bottom: 1.25rem;
}
.stat {
  font-size: inherit;
  font-weight: inherit;
}






@media(max-width: 1280px) {
  .stat-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 100px;
    grid-row-gap: 20px;
    padding: 2rem 0;
    justify-items: center;
    position: relative;
  }
  .stat-text:nth-of-type(4n + 1) { justify-self: end; }
  .stat-text:nth-of-type(4n + 3) { justify-self: start; }

  .stat-wrap:after {
    content: '';
    position: absolute;
    width: 515px;
    height: 2px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #000A5D;
  }
  .stat-wrap:before {
    content: '';
    position: absolute;
    width: 2px;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #000A5D;
  }

  .stat-text {
    flex-basis: 50%;
  }
  .stat-text span {
    margin-bottom: 1.5rem;
  }

  .stat-line {
    display: none;
  }
  .cta-text-wrap {
    width: 80%;
    top: 10%;
  }
  .cta-text-wrap > span {
    margin-bottom: 1rem;
    font-size: xx-large;
  }
  .cta-btn {
    padding: 5px 15px;
  }

}


@media(max-width: 550px) {
  .stat-wrap {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    row-gap: 20px;
  }

  .stat-line {
    height: 2px;
    width: 75%;
    justify-self: center;
    align-self: center;
    display: none;
  }

  .stat-wrap:after, .stat-wrap:before { display: none }

  .stat-text {
    flex-basis: auto;
    margin: auto;
  }

  .stat-text:after {
    width: 110%;
    height: 2px;
    content: '';
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #000A5D;
    position: absolute;
  }
  .stat-text:last-of-type:after {
    display: none;
  }
}

</style>
<style>
.vision-char-ani {
  display: inline-block;
  animation: charAni .2s ease forwards;
  transform-origin: center;
  will-change: transform;
}
@keyframes charAni {
  0%{transform: scale(1)}
  50%{transform: scale(1.5)}
  100%{transform: scale(1)}
}

</style>


<template>
  <section class="overflow-x-clip pt-24 pb-2 px-4 sm:px-10 md:px-16 lg:px-16 xl:px-20 2xl:px-28 section-wrap relative">
    <div class="half-circle-wrap absolute top-0 right-0" ref="halfCircleWrapEl">
      <svg
          width="1032"
          height="759"
          viewBox="0 0 1032 759"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="relative half-circle"
      >
        <defs>
          <!-- your existing gradient -->
          <linearGradient id="paint0_linear_46_566" x1="729" y1="759" x2="729" y2="-699" gradientUnits="userSpaceOnUse">
            <stop stop-color="#007AFD"/>
            <stop offset="0.639423" stop-color="white"/>
          </linearGradient>
        </defs>

        <path
            ref="halfCircleEl"
            d="M246.738 30
              A482.262 482.262 0 1 1 1211.262 30
              A482.262 482.262 0 1 1 246.738 30"
            fill="none"
            stroke="url(#paint0_linear_46_566)"
            stroke-width="150"
            opacity="0.4"
            vector-effect="non-scaling-stroke"
            transform="scale(-1,1) translate(-1458,0)"
            style="will-change: stroke-dashoffset"
        />
      </svg>

    </div>
    <div class="
      head-wrap grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr]
      justify-center md:px-5 mt-8 xl:mt-14 gap-16 md:gap-12 2xl:gap-16 items-center
    ">
      
      <div class="header-text text-nowrap w-3/5 ">
        <h2
            class="text-cetacean text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-normal uppercase lg:mb-14 about-header"
        >Celebrating<br><span
            class="text-5xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black"
        >100 Years</span></h2>


      </div>
      <div class="
      slideshow-wrap lg:row-span-2 lg:col-start-2
      mx-auto lg:mr-0 lg:ms-auto
      w-11/12 md:w-5/6 lg:w-11/12 ">
        <div class="slideshow w-full h-full">
          <div class="spinner-wrap" v-if="!imagesLoaded">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="spinner"
            >
              <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="#FFFFFF"/></svg>

          </div>
          <img
              v-if="imagesLoaded"
              v-for="(image, index) in slideshowImages"
              :key="index"
              :src="image"
              :class="['slideshow-image', { active: currentSlide === index }]"
              alt="Timeline image"
          />
        </div>

      </div>
      <div class="vision-text-wrap text-wrap ps-2">
        <h3 class="text-4xl font-extrabold mb-5">SINCE 1925</h3>
        <p class="mb-5">
          Over our 100-year history, we have transformed the way residents and local organizations come together to drive lasting change across the region.
        </p>
        <p>
          We have been proud to serve as a charitable resource for the community. To make an even greater impact, we have worked to build a powerful network of changemakers—donors, nonprofits, residents, businesses, policymakers, and all people who are committed to the success and wellbeing of Greater Hartford.
        </p>

      </div>


    </div>





    <div class="stat-wrap mt-16 md:mt-20 lg:mt-20 xl:mt-36 2xl:mt-40 mb-44  md:mb-64 lg:mb-64 xl:mb-96 py-37">
      <div class="stat-text">
        <h2>$<span class="stat" id="billion">1.1</span>B</h2>
        <span class="uppercase">Granted</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: .5s">
        <h2 class="stat">1500</h2>
        <span class="uppercase">Donor Funds</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: .75s">
        <h2>$<span class="stat">30</span>M</h2>
        <span class="uppercase">In Scholarships</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: 1s">
        <h2 class="stat">29</h2>
        <span class="uppercase">Community Funds</span>
      </div>
    </div>


    <svg
        viewBox="0 0 1728 351"
        xmlns="http://www.w3.org/2000/svg"
        class="w-screen absolute arc"
    >
      <path
          d="M864 0C1276.64 0 1558.5 91.9994 1728.5 141.999V351C1728.5 351 1407 209 899.5 201C392 193 0 338.5 0 338.5V248V134C185 76.4995 451.362 4.76181e-05 864 0Z"
          fill="white"
      />

      <path
          d="M864 0C1276.64 0 1558.5 91.9994 1728.5 141.999V351C1728.5 351 1407 209 899.5 201C392 193 0 338.5 0 338.5V248V134C185 76.4995 451.362 4.76181e-05 864 0Z"
          fill="url(#paint0_radial_48_567)"
          fill-opacity="0.8"
      />

      <defs>
        <radialGradient
            id="paint0_radial_48_567"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(212 -992 1472.19 313.358 850.999 924)"
            gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.4375" stop-color="white"/>
          <stop offset="0.834497" stop-color="#007AFD"/>
        </radialGradient>
      </defs>
    </svg>


  </section>
</template>

<script setup lang="ts">
import anime from 'animejs';
import { onMounted, nextTick, ref, onUnmounted, computed, watch } from 'vue';
import { usePosts } from '~/composables/usePosts';
import {useNuxtApp} from "#imports";

// Fetch timeline posts, vue y u so hard
// Hey don't hurt vue's feelings :<
const { data: posts } = usePosts();


// Get timeline images from posts, one from each decade
const slideshowImages = computed(() => {
  if (!posts.value || !Array.isArray(posts.value)) return [];
  
  // Filter posts with images and years
  const postsWithImages = posts.value
    .filter((post: Post) => {
      const hasImage = post.eventOptions?.thumbnail?.node?.sourceUrl ||
                       post.eventOptions?.thumbnail?.node?.mediaItemUrl;
      const hasYear = post.eventOptions?.eventYear;
      return hasImage && hasYear && post.slug !== 'greater-hartford-gives';
    });

  // Filter out posts with image smaller than 1.1/1 aspect ratio
  let viablePosts = postsWithImages.filter((post: Post) => {
    const details = post?.eventOptions?.thumbnail?.node?.mediaDetails;
    if(!details?.width || !details?.height) return false;


    return (details?.width / details?.height) >= 1.1;
  })

  if(viablePosts.length < 10) viablePosts = postsWithImages;

  // Group posts by decade
  const postsByDecade = new Map<number, Post[]>();
  
  viablePosts.forEach((post: Post) => {
    const year = parseInt(post.eventOptions.eventYear);
    const decade = Math.floor(year / 10) * 10; // Get decade (1920, 1930, etc.)
    
    if (!postsByDecade.has(decade)) {
      postsByDecade.set(decade, []);
    }
    postsByDecade.get(decade)!.push(post);

  });
  
  // Get one image from each decade, sorted by decade (newest to oldest)
  const decades = Array.from(postsByDecade.keys()).sort((a, b) => b - a);

  // Set wide logo image as first in slideshow + return urls sorted by
  return [
    'https://leamh.org/hartford_foundation/wp-content/uploads/2025/12/Primary-Logo-Reversed-scaled.jpg',
      ...decades.map(decade => {
        const decadePosts = postsByDecade.get(decade)!;

        // Get the first (most recent) post from this decade
        const sortedDecadePosts = decadePosts.sort((a, b) =>
            parseInt(b.eventOptions.eventYear) - parseInt(a.eventOptions.eventYear)
        );
        const post = sortedDecadePosts[0];
        return post.eventOptions.thumbnail.node.sourceUrl ||
            post.eventOptions.thumbnail.node.mediaItemUrl;
      })
  ]

});

const halfCircleEl = ref<SVGPathElement | null>(null);
const halfCircleWrapEl = ref<HTMLElement | null>(null);

const currentSlide = ref(0);
let slideshowInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async ()  =>  {

  await nextTick();

  setTimeout(async () => {
    if(halfCircleEl.value && halfCircleWrapEl.value) {
      const stroke = halfCircleEl.value;
      const len = stroke.getTotalLength();

      stroke.style.strokeDasharray = `${len}`;
      stroke.style.strokeDashoffset = `${len}`;

      await nextTick();
      halfCircleWrapEl.value.style.opacity = '1';

      stroke.getBoundingClientRect();
      stroke.style.transition = 'stroke-dashoffset 2.5s ease-in';
      stroke.style.strokeDashoffset = '0';

    }
  }, 1250)

  await nextTick()

  const stats = Array.from(document.querySelectorAll('.stat'));
  if(stats.length < 1) return;

  const statData: Array<{element: HTMLElement, target: number}> = [];

  stats.forEach(stat => {
    const target = parseFloat(stat.textContent?.trim() || '0');
    statData.push({ element: stat as HTMLElement, target });
    stat.textContent = `${Math.floor(target * 0.25)}`
  })
  console.log(statData)


  const statWrap = document.querySelector('.stat-wrap') || null;
  console.log(statWrap)
  if(!statWrap) return;
  const statTextWraps = Array.from(statWrap.querySelectorAll('.stat-text')) || null;
  if(statTextWraps.length < 1) return;
  console.log(statTextWraps)
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        statTextWraps.forEach(el => {el.classList.add('animate-in')})
        statObserver.unobserve(statWrap);
      }
    })
  }, {threshold: .5})
  statObserver.observe(statWrap);


  statTextWraps.forEach((stat, idx) => {
    stat.addEventListener('transitionend', function triggerCount() {
      stat.removeEventListener('transitionend', triggerCount);
      const data = statData[idx];
      if(data) {
        statCount(data.element, data.target, data.element.id === 'billion');
      }
    })
  })





});

// Start slideshow
const startInterval = () => {
  slideshowInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slideshowImages.value.length;
  }, 3000); // Change image every 3 seconds
  anime({ targets: '.text-center', opacity: [0,1], duration: 700 });
}


const imagesLoaded = ref(false);
watch([slideshowImages], async () => {
  if(slideshowImages.value.length < 1) return;
  imagesLoaded.value = true;
  await nextTick();
  startInterval();
})

onUnmounted(() => {
  // Clean up slideshow interval
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
  }
});




function statCount(el: HTMLElement, target: number, billion = false) {
  let curr = Math.floor(target * 0.25);
  let increment = Math.ceil((target - curr) / 60);

  if(billion) {
    curr = 0;
    increment = .025;
  }

  const interval = setInterval(() => {
    curr += increment;
    if(curr >= target) {
      curr = target;
      el.textContent = `${target}`
      clearInterval(interval);
    } else {
      if(billion) {
        const toDisplay = curr.toFixed(2);
        el.textContent = `${toDisplay}`
      } else {
        el.textContent = `${curr}`;
      }
    }
  }, 40); // Increased from 25ms to 40ms
}

</script>

