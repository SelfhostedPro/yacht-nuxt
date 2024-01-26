import { Server as NuxtServer } from 'node:http'
import { Server, Socket } from "socket.io";
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin';
let _nuxtServer: NuxtServer

export default defineNitroPlugin(() => {
    const io = new Server(_nuxtServer)
    io.on("connection", (socket: Socket) => {
      socket.emit('message', "Hello World")
    });
})

export const setNuxtServer = (nuxtServer: NuxtServer) => {
    _nuxtServer = nuxtServer
}