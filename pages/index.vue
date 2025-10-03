<style>
  .timeline-img-ani {
    transition: transform .75s ease-in-out, opacity .5s !important;
    transform: translateX(0) !important;
    opacity: 1 !important;
}
  .stat-wrap {
    display: flex;
    background: linear-gradient(140deg, #007afd69, #ffffff00 65%);
    justify-content: space-evenly;
    text-align: center;
    color: #000A5D;
    padding: 7rem 5rem;
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
  }
  .animate-in {
    transform: none !important;
    opacity: 1 !important;
  }
  .stat-text > span {
    font-weight: bolder;
    font-size: large;
  }
  .stat {
    font-size: 4.5rem;
    font-weight: bolder;
    margin-bottom: 1.25rem;
  }
  .call-to-action {
    position: relative;
    margin-bottom: -15%;
  }
  .call-to-action img {
    display: block;
    width: 100%;
    height: auto;
  }
  .cta-text-wrap {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    flex-direction: column;
    justify-content: start;
    text-align: center;
    color: white;
    align-items: center;
  }
  .cta-head {
    font-size: large;
    font-weight: bold;
    margin-bottom: 1.75rem;
    position: relative;
    display: inline-block;
    z-index: 0;
  }
  .cta-head::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 130%;
    height: 50%;
    background: #3d98ff;
    z-index: -1;
  }
  .cta-text-wrap > span {
    font-size: 2.5rem;
    max-width: 70%;
    font-weight: bold;
    margin-bottom: 3.5rem;
  }
  .cta-btn {
    padding: 15px 25px;
    background: #007AFD;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0px 0px #70bdff36;
    transition: transform .25s, box-shadow .2s ease-in-out;
  }
  .cta-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0px 7px 9px 0px #70bdff36;
  }
  @media(max-width: 1200px) {
    .stat-wrap {
      padding: 3rem 1rem;
    }
    .stat {
      font-size: xxx-large;
    }
    .cta-text-wrap {
      top: 15%;
      width: 70%;
    }
    .cta-text-wrap > span {
      max-width: unset;
    }
  }
  @media(max-width: 800px) {
    .stat-wrap {
      flex-wrap: wrap;
      padding: 2rem 6rem;
    }
    .stat-text {
      flex-basis: 50%;
      margin-top: 2rem;
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
      padding: 2rem 3rem;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      gap: 20px;
    }
    .stat-text {
      flex-basis: auto;
      margin: auto;
    }
    .stat {
      margin-bottom: auto;
    }
    .stat-line {
      width: 75%;
      height: 2px;
      display: block;
    }
    .cta-text-wrap {
      top: 5px;
    }
    .cta-text-wrap > span{
      font-size: 18px;
      font-weight: 600;
    }
    .call-to-action > img {
      width: 100%
    }
    .call-to-action {
      margin-bottom: -20%;
    }
    .cta-btn {
      font-size: 12px
    }
  }


</style>
<template>
  <div>
    <HeroAniBg
      v-if="route.query.hero === 'ani'"
    />
    <Hero v-if="route.query.hero !== 'ani' && route.query.hero !== 'park'" />
    <HeroParkBelow
      v-if="route.query.hero === 'park'"
    />
    <Vision />

    <div class="stat-wrap">
      <div class="stat-text">
        <h2 class="stat">840</h2>
        <span>PROJECTS COMPLETED</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: .25s">
        <h2 class="stat">260</h2>
        <span>ACTIVE CLIENTS</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: .5s">
        <h2 class="stat">391</h2>
        <span>CUPS OF COFFEE</span>
      </div>
      <div class="stat-line"></div>
      <div class="stat-text" style="transition-delay: .75s">
        <h2 class="stat">573</h2>
        <span>NEW INVESTORS</span>
      </div>
    </div>


    <div class="call-to-action">
      <div class="cta-text-wrap">
        <div class="cta-head-bg">
          <h2 class="cta-head">JOIN US</h2>
        </div>
        <span>Are you <span style="color: #007AFD">interested</span> in taking part in the work we do?</span>
        <h2 class="cta-btn">VISIT OUR MAIN WEBSITE</h2>
      </div>
      <img src="../public/Celebration_GIving_74.png" alt="Giving Celebration">
    </div>



    <Timeline />
  </div>
</template>

<script lang="ts" setup>
import Hero from '~/components/hero.vue';
import anime from 'animejs';
import { onMounted, nextTick } from 'vue';
import Vision from "~/components/vision.vue";
import HeroParkBelow from "~/components/hero-park-below.vue";
import HeroAniBg from "~/components/hero-ani-bg.vue";
import {useRoute} from '#app';

const route = useRoute()

onMounted(async ()  =>  {
  anime({ targets: '.text-center', opacity: [0,1], duration: 700 });
  await nextTick()

  const stats = Array.from(document.querySelectorAll('.stat'));
  if(stats.length < 1) return;

  const targetNums: number[] = [];

  stats.forEach(stat => {
    targetNums.push(parseInt(stat.textContent));
    stat.textContent = `${parseInt(stat.textContent) - 75}`
  })
  console.log(targetNums)


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
      statCount(stat.querySelector('h2') as HTMLElement, targetNums[idx]);
    })
  })

});

function statCount(el: HTMLElement, target: number) {
  let curr = target - 75;
  const interval = setInterval(() => {
    el.textContent = `${curr}`;
    if(curr === target) {
      clearInterval(interval);
    }
    curr++;

  }, 25);
}


</script>

<style></style>