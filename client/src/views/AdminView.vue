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
  <section>
    <h1>AdminView works</h1>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="clearMessanges"
    >
      Clear Messanges
    </button>
    <div class="flex">
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
    <div class="flex">
      <div v-for="gif in gifs" :key="gif.imgName">
        <img
          :src="`/images/${gif.imgName}`"
          :alt="gif.imgName"
          class="icons"
          @click="sendImageUrl(gif)"
          :class="{ disable: !gif.active && imageSent }"
        />
      </div>
    </div>
    <p v-if="wasClicked">Das Bild wurde angeklickt!</p>
  </section>
</template>

<style scoped>
.icons {
  max-width: 5rem;
  max-height: 5rem;
  object-fit: cover;
}

.disable {
  filter: grayscale(1);
}
</style>
