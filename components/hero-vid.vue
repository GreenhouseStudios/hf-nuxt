<style scoped>
html {
  scrollbar-gutter: stable;
}
.hero-vid.animate {
  --crop-scale: .082;
  animation: vid-ani .25s ease-in .25s forwards;
}

@keyframes vid-ani {
  from {opacity: 1;}
  to  {opacity: 0;}
}


.hero-vid {
  pointer-events: none;
  position: relative;
  z-index: 1;
  height: 100vh;
}

.cropped-logo.fade {
  animation: fade .5s ease-in forwards;
}
@keyframes fade {
  from {opacity:1}
  to {opacity: 0}
}

.cropped-logo {
  height: 100vh;
  pointer-events: none;
  will-change: transform, top, left;
  transition: top 1s, left .25s, opacity .5s ease-in;
  transform-origin: top left;
  --crop-scale: .082;
  --crop-x: 0px;
  --crop-y: 0px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: -1;
  background-image: url("../public/hf_logo_crop.png");
  background-size: cover;
  background-position: center;
  }

</style>



<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import anime from 'animejs';
import {useFirstVisit} from "~/composables/useFirstVisit";

const { markSeen } = useFirstVisit();

const vidEl = ref<HTMLVideoElement | null>(null);
const shouldTeleport = ref(false);


defineExpose({
  vidEl
})


const navTeleportEl = inject<Ref<HTMLElement | null>>('navTeleportEl', ref(null));


onMounted(() => {

  const cropped = <HTMLElement>document.querySelector('.cropped-logo');
  const logo = document.getElementById('nav-img');
  if(!cropped || !logo) return;

  function checkScrollLock() {
    return new Promise(resolve => {
      const observer = new MutationObserver(entries => {
        const isLocked = getComputedStyle(document.body).overflow === 'hidden';
        if (isLocked) {
          observer.disconnect();
          resolve(isLocked);
        }
      })
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style']
      })
    })
  }

  let move = true;

  checkScrollLock().then(() => {
    if(!vidEl.value) return;
    const cropRect = cropped.getBoundingClientRect();
    cropped.style.width = `${cropRect.width}px`;
    cropped.style.height = `${cropRect.height}px`;
    vidEl.value.play();
    vidEl.value.addEventListener('ended', () => {
      if(!vidEl.value) return;


      document.body.style.overflow = '';
      vidEl.value.classList.add('animate');
      if(move) {
        const scale = calcCropScale();
        const tl = anime.timeline({ autoplay: false, });
        tl.add({
          delay: 500,
          targets: cropped,
          translateY: -77,
          translateX: 1,
          scale: scale,
          duration: 1250,
          easing: "easeInOutCubic",
          complete: () => {
            markSeen()
          }
        })
        tl.play();
        setTimeout(() => {
          logo.classList.replace('clipped', 'partial-clip');
        }, 1250)
      } else {
        logo.style.opacity = '0';
        logo.style.transition = 'none';
        logo.classList.remove('clipped');
        logo.style.clipPath = 'none';
        vidEl.value.addEventListener('animationend', () => {
          cropped.classList.add('fade');
          logo.classList.add('fade');
        })
      }



    })
    shouldTeleport.value = true;
  })
  function calcCropScale() {
    const cropRect = cropped?.getBoundingClientRect();
    return (70 / cropRect.height).toFixed(4);
  }

  function calcCropPos() {
    if(!logo || !cropped) return;
    const logoRect = logo.getBoundingClientRect();
    const cropRect = cropped.getBoundingClientRect();
    const scale = parseFloat(getComputedStyle(cropped).getPropertyValue('--crop-scale'));
    const toMove = {
      x: logoRect.left - cropRect.left - (logoRect.left - 1.5),
      y: logoRect.top - cropRect.top - (cropRect.height * .36) - 2
    }

    return toMove;
  }



  })




</script><template>
  <teleport :to="navTeleportEl" :disabled="!shouldTeleport">
    <div class="cropped-logo"></div>
    <video class="hero-vid" ref="vidEl" src="../public/HF_LOGO.mp4" type="video/mp4"
           muted
           preload="auto"
           playsinline
           style="object-fit: cover; width: 100%; height: 100%"
    >
    </video>
  </teleport>

</template>