<style scoped>
.section-wrap {
  transform: translateY(28rem);
  margin-bottom: 28rem;
}


.vision-head {
  width: 70%;
  margin: auto;
}
.head-text {
  font-weight: bold;
  position: relative;
  color: #000A5D;
  line-height: 1;
}
.head-text::after {
  content: '';
  top: 50%;
  transform: translateY(-45%);
  left: -35px;
  position: absolute;
  background: #007AFD;
  height: 75%;
  width: 15px;
}
.head-text > span {
  font-weight: bolder;
  text-shadow:
      0  1px 0 #000A5D,  0 -1px 0 #000A5D,
      1px 0  0 #000A5D, -1px 0  0 #000A5D,
      1px 1px 0 #000A5D, -1px 1px 0 #000A5D,
      1px -1px 0 #000A5D, -1px -1px 0 #000A5D;
}

.vision-vid-wrap {
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vision-vid {
  width: 500px;
  height: 300px;
  background: grey;
  border-radius: 25px;
}

.vision-text-wrap {
  display: flex;
  flex-direction: column;
  width: 40%;
  color: #000A5D;
}

.vision-text-wrap > h3 {
  font-size: xx-large;
  font-weight: bolder;
  margin-bottom: .5rem;
}

.vision-text-wrap > p {
  color: #000A5D;
  font-size: large;
  margin-bottom: 3rem;
}

.vision-list {
  margin-bottom: 0;
  margin-top: auto;
  font-size: large;
}

.list-item {
  display: flex;
  align-items: center;
}
.list-item::before {
  content: '\2713'; /* Unicode for checkmark */
  margin-right: 20px;
  font-size: xxx-large;
  line-height: 1;

  color: #007AFD;
}

@media(max-width: 1000px) {
  .vision-vid-wrap {
    flex-direction: column;
    gap: 20px;
    margin: 2rem auto;
  }
  .vision-text-wrap {
    width: 75%;
  }
  #vision-bold {
    text-shadow: none;
  }
  .head-text:after {
    width: 7px;
    left: -20px;
  }
}
@media(max-width: 600px) {
  .vision-text-wrap {
    width: 90%;
  }
  .vision-vid {
    width: 80vw;
    height: 300px;
  }
}
@media(max-width: 400px) {
  .vision-head {
    width: 95% !important;
  }
}

.timeline-img-ani {
  transition: transform .75s ease-in-out, opacity .5s !important;
  transform: translateX(0) !important;
  opacity: 1 !important;
}
.stat-wrap {
  display: flex;
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
  pointer-events: none;
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
  <section class="overflow-x-clip px-7 pt-36 section-wrap">
    <div class="vision-head">
      <strong class="head-text text-3xl lg:text-3xl xl:text-4xl">
        ABOUT THE<br>
        <span id="vision-bold" class="text-5xl lg:text-5xl xl:text-6xl">TIMELINE</span>
      </strong>
    </div>
    <div class="vision-vid-wrap w-full lg:w-9/10 2xl:w-7/10">
      <div class="vision-vid"></div>
      <div class="vision-text-wrap">
        <h3>SINCE 1925</h3>
        <p>
          We are committed to providing our customers with the best service,
          to serve, to create, and lorem ipsum. We are proud of everyone's achievement.
        </p>
        <ul class="vision-list">
          <li class="list-item">bullet point</li>
          <li class="list-item">bullet point</li>
          <li class="list-item">bullet point</li>
        </ul>
      </div>
    </div>

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


  </section>

</template>

<script setup lang="ts">
import anime from 'animejs';
import { onMounted, nextTick } from 'vue';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'


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



  const visionHead = document.querySelector('.vision-head');
  if(!visionHead) return;
  gsap.fromTo(visionHead,
      {x: -200, opacity: 0},
      {
        x: 0,
        opacity: 1,
        ease: 'power1.out',
        duration: .5,
        scrollTrigger: {
          trigger: visionHead,
          start: 'top 85%',
          once: true,
        },
        onStart: visionBoldAni
      },
  )
  const listEls = Array.from(document.querySelectorAll('.list-item'))
  if(listEls.length > 0) {
    listEls.forEach(el => {
      gsap.fromTo(el,
          {x: 100 + (listEls.indexOf(el) * 15), opacity: 0},
          {
            x: 0,
            opacity: 1,
            ease: 'power3.inOut',
            delay: listEls.indexOf(el) * .5 + .5,
            duration: .5,
            scrollTrigger: {
              trigger: '.vision-list',
              start: 'top 85%',
              once: true
            }
          }
      )
    })
  }

  function visionBoldAni() {
    const textLarge = document.querySelector('#vision-bold');
    if(!textLarge) return;
    const text: string[] = [];
    for(let i = 0; i < textLarge.textContent.length; i++) {
      text.push(textLarge.textContent[i]);
    }
    if(text.length < textLarge.textContent.length) return;
    textLarge.innerHTML = '';
    text.forEach((char, idx) => {
      const charEl = document.createElement('span');
      charEl.textContent = `${char}`;
      if(char === ' ') charEl.style.display = 'inline';
      charEl.style.animationDelay = `${(idx * .025) + .25}s`;
      charEl.className = 'vision-char-ani';
      textLarge.appendChild(charEl);
    })
  }


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

