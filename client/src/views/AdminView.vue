<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SocketioService from './../services/socketio.service.ts'
import type ImageData from '@/models/ImageData.interface.ts'
import { images, gifs } from '@/models/ImageData.ts'
const USERNAME = 'Papa'

const wasClicked = ref(false)
let imageSent = ref(false)

onMounted(() => {
  SocketioService.setupSocketConnection()
  SocketioService.socket.on('image was clicked', (imgUrl: string) => {
    wasClicked.value = true

    images.forEach((image) => {
      if (`/images/${image.imgName}` === imgUrl) {
        image.active = false
      }
    })
    gifs.forEach((gif) => {
      if (`/images/${gif.imgName}` === imgUrl) {
        gif.active = false
      }
    })

    imageSent.value = false
  })
})

onBeforeUnmount(() => {
  SocketioService.disconnect()
})

const sendImageUrl = (image: ImageData) => {
  const imgUrl = `/images/${image.imgName}`
  SocketioService.socket.emit('send image', imgUrl)
  image.active = true
  imageSent.value = true
}

const clearMessanges = () => {
  images.forEach((img) => (img.active = false))
  gifs.forEach((gif) => (gif.active = false))
  SocketioService.socket.emit('send image', null)
  imageSent.value = false
}
</script>

<template>
  <section class="mx-auto p-4 flex flex-col items-center">
    <h1 class="text-4xl font-semibold pb-4">FamNotify</h1>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      @click="clearMessanges"
    >
      Clear Messanges
    </button>
    <div class="flex justify-between w-full max-w-100 mb-4">
      <div v-for="image in images" :key="image.imgName">
        <img
          :src="`/images/${image.imgName}`"
          :alt="image.imgName"
          class="icons"
          @click="sendImageUrl(image)"
          :class="{ disable: !image.active && imageSent }"
        />
      </div>
    </div>
    <div class="gifContainer flex justify-center w-full max-w-100 flex-wrap gap-2">
      <div
        v-for="gif in gifs"
        :key="gif.imgName"
        class="w-full md:w-1/3 flex-grow flex justify-center mb-3"
      >
        <img
          :src="`/images/${gif.imgName}`"
          :alt="gif.imgName"
          class="gifs max-w-full scale-100 hover:scale-105 transition-transform duration-200 ease-in-out"
          @click="sendImageUrl(gif)"
          :class="{ disable: !gif.active && imageSent }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.icons {
  height: 100%;
  max-width: 5rem;
  max-height: 5rem;
  object-fit: contain;
}

.icons:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.disable {
  filter: grayscale(1);
}

.gifs {
  border-radius: 1rem;
}

.gifContainer div:last-of-type {
  max-width: 70%;
}

@media screen and (max-width: 767px) {
  .gifContainer div:last-of-type {
    max-width: 100%;
  }
}

@media screen and (max-width: 430px) {
  .gifContainer {
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: center;
  }

  .gifs {
    max-width: 100%;
  }
}
</style>
