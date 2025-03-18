<template>
   <div className="modal-overlay">
    <div className="flex flex-col items-center justify-start gap-4 overflow-scroll modal">
      <div className="flex flex-col justify-center gap-5 px-24 text-left py-80 modal-content">
        <h1 className="text-5xl font-bold text-white ">
          {modalBlok.name}
        </h1>
        <p className="text-2xl font-bold text-white">
          {modalBlok.description}
        </p>
      </div>
      <div className="flex flex-col justify-center gap-5 px-24 pt-32 text-left pb-96 modal-content">
        <h1 className="text-2xl font-bold text-black">
          Title of the Event
        </h1>
        <p className="text-xl text-black">
          
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>