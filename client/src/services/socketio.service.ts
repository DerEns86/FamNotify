import { io } from 'socket.io-client'

const SERVER_URL =
  window.location.hostname === 'localhost'
    ? import.meta.env.VITE_SOCKET_ENDPOINT_LOCAL
    : import.meta.env.VITE_SOCKET_ENDPOINT_NETWORK

class SocketioService {
  socket: any

  imageClicked = false
  constructor() {}

  setupSocketConnection() {
    console.log(SERVER_URL)
    this.socket = io(SERVER_URL)

    this.socket.on('connect', () => {
      console.log('Connected to the server!')
    })

    this.socket.on('my broadcast', (data: any) => {
      console.log(data)
    })
  }

  sendImageClick() {
    this.imageClicked = true
    console.log('Bild wurde geklickt:', this.imageClicked)
    this.socket.emit('image clicked', true)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

export default new SocketioService()
