<style scoped>
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
  margin: auto;
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

  color: #007AFD; /* Optional styling */
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
  <section class="overflow-x-clip bg-amber-200 px-7 py-15">
    <div class="vision-head">
      <strong class="head-text text-3xl lg:text-3xl xl:text-4xl">
        ABOUT THE<br>
        <span id="vision-bold" class="text-5xl lg:text-5xl xl:text-6xl">TIMELINE</span>
      </strong>
    </div>
    <div class="vision-vid-wrap w-full lg:w-9/10 2xl:w-7/10">
      <div class="vision-vid"></div>
      <div class="vision-text-wrap">
        <h3>Since 1925</h3>
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
  </section>



</template>

<script setup lang="ts">


})


</script>