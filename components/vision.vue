<style scoped>
.vision-head {
  width: 70%;
  margin: auto;
}
.head-text {
  font-weight: bold;
  position: relative;
  font-size: xxx-large;
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
  font-size: 4rem;
  font-weight: bolder;
  text-shadow:
      0  1px 0 #000A5D,  0 -1px 0 #000A5D,
      1px 0  0 #000A5D, -1px 0  0 #000A5D,
      1px 1px 0 #000A5D, -1px 1px 0 #000A5D,
      1px -1px 0 #000A5D, -1px -1px 0 #000A5D;
}

.vision-vid-wrap {
  margin: 7rem auto;
  display: flex;
  width: 65%;
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

  color: #007AFD; /* Optional styling */
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
  <div class="vision-head">
    <strong class="head-text">
      THIS IS<br>
      <span id="vision-bold">OUR VISION</span>
    </strong>
  </div>
  <div class="vision-vid-wrap">
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


</template>

<script setup lang="ts">
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {onMounted, onBeforeUnmount} from 'vue';

gsap.registerPlugin(ScrollTrigger);

const triggers: ScrollTrigger[] = [];

onMounted(() => {

  const visionHead = document.querySelector('.vision-head')
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
      console.log(listEls.indexOf(el))
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



})


</script>