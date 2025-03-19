<template>

  <div class="flex flex-col grow overflow-hidden shadow-md rounded-2xl column hover:bg-gray-200 feature shrink" @click="showModal">
    <img :src="`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 10}/${Math.floor(Math.random()*100) + 300}/${Math.floor(Math.random()*100) + 300}`"
      class="bg-auto shrink" alt="">
    <CardContent />
  </div>

</template>

<script lang="ts" setup>
import { useStore } from '~/stores/store';

const store = useStore();
const randomMultiplier = Math.ceil(Math.random() * 2);

const showModal = () => {
  store.toggleModal();
}
</script>

<style scoped>
.feature-content {
  background-color: #DEEDFF;

}

.feature {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
}

/* card */

/* Auto layout */
/* display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 16px;

position: absolute;
width: 418px;
height: 421px;
left: 0px;
top: 0px;

background: rgba(0, 122, 253, 0.13);

border-radius: 15px; */
</style>