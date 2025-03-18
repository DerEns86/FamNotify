<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SocketioService from './../services/socketio.service.ts'
import type ImageData from '@/models/ImageData.interface.ts'
const USERNAME = 'Kinder'

const imageUrl = ref<string | null>(null)
const image = ref<ImageData | null>(null)

onMounted(() => {
  SocketioService.setupSocketConnection()
  SocketioService.socket.on('receive image', (url: string) => {
    imageUrl.value = url
  })
})

onBeforeUnmount(() => {
  SocketioService.disconnect()
})

const handleImageClick = () => {
  if (imageUrl.value) {
    SocketioService.socket.emit('image clicked', imageUrl.value)
    imageUrl.value = null
  }
}
</script>
<template>
  <div>
    <h1>ClientView works</h1>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt=""
      style="max-width: 300px"
      class="cursor-pointer"
      @click="handleImageClick"
    />
  </div>
</template>

<style scoped></style>
