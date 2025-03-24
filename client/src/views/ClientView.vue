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
    const audio = new Audio('/sounds/in.mp3')
    audio.play()
  })
})

onBeforeUnmount(() => {
  SocketioService.disconnect()
})

const handleImageClick = () => {
  if (imageUrl.value) {
    SocketioService.socket.emit('image clicked', imageUrl.value)
    imageUrl.value = null
    const audio = new Audio('/sounds/out.mp3')
    audio.play()
  }
}
</script>
<template>
  <section class="overflow-hidden">
    <img src="/images/minecraft.png" alt="" class="minecraft" />
    <div class="background">
      <div v-if="imageUrl" class="msg-wrapper">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt=""
          class="cursor-pointer"
          @click="handleImageClick"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.background {
  position: relative;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background-image: url('images/background.jpg');
  background-size: cover;
  background-position: center;
}

.minecraft {
  width: 30%;
  /* height: 30%; */
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.msg-wrapper {
  position: absolute;
  background-image: url('images/splash.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: transform 0.2s;
  width: 100vw;
  height: 100svh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.msg-wrapper img {
  max-width: 45%;
  max-height: 45%;
  border-radius: 2rem;
}
</style>
