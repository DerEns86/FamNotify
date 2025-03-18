<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SocketioService from './../services/socketio.service.ts'
const USERNAME = 'Papa'

const wasClicked = ref(false)

onMounted(() => {
  SocketioService.setupSocketConnection()
  SocketioService.socket.on('image was clicked', () => {
    wasClicked.value = true
  })
})

onBeforeUnmount(() => {
  SocketioService.disconnect()
})

const sendImageUrl = (imageName: string) => {
  const imgUrl = `/images/${imageName}`
  SocketioService.socket.emit('send image', imgUrl)
}
</script>

<template>
  <section>
    <h1>AdminView works</h1>
    <button @click="sendImageUrl('test.png')">Bild 1 senden</button>
    <button @click="sendImageUrl('test2.png')">Bild 2 senden</button>
    <p v-if="wasClicked">Das Bild wurde angeklickt!</p>
  </section>
</template>

<style scoped></style>
