import type { ServerContainers } from '~/types/servers'
import type { Container, ContainerStats } from '~/types/containers/yachtContainers'
import { defineStore } from 'pinia'
import type { CreateContainerForm } from '~/types/containers/create'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
    container: {} as Container,
    stats: {} as ContainerStats,
    loading: [] as string[],
  }),
  getters: {
    getContainers: (state) => state.servers,
  },
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    async fetchContainers() {
      this.startLoading('containers')
      const { error, data } = await useFetch('/api/containers', { lazy: false })
      data.value ? this.servers = data.value : null
      this.stopLoading('containers')
      return { error, data }
    },
    async fetchContainerDetails(server: string, id: string) {
      this.startLoading(id)
      const { error, data } = await useFetch(`/api/containers/${server}/${id}`)
      data.value ? this.container = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(id)
      return { error, data }
    },
    async fetchCreateContainer(form: CreateContainerForm) {
      this.startLoading('create')
      const { error, data } = await useFetch(`/api/containers/`, {
        method: 'POST',
        body: form,
      })
      data.value ? this.container = data.value : console.log(error.value)
      if (error.value) { this.stopLoading('create'); throw error.value }
      this.stopLoading('create')
      return { error, data }
    },
    async fetchContainerAction(server: string, id: string, action: string) {
      this.startLoading(id)
      const { error, data } = await useFetch(`/api/containers/${server}/${id}/actions/${action}`)
      // @ts-ignore
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(id)
      return { error, data }
    },
    async fetchContainerStats() {
      this.startLoading('stats')
      const abort = new AbortController()
      const self = this
      await useSse('/api/containers/stats', {
        async onopen(response) {
          if (response.ok) {
            console.log('Connected to stats SSE')
            self.stopLoading('stats')
          } else {
            console.log('Failed to connect to stats SSE')
            self.stopLoading('stats')
          }
        },
        async onmessage(event) {
          const stat = JSON.parse(JSON.parse(event.data))
          self.stats[stat.name] = stat
        },
        onclose() {
          console.log('Closed stats SSE')
          self.stopLoading('stats')
        },
        onerror(error) {
          console.log('Error connecting to stats SSE')
          console.log(error)
          self.stopLoading('stats')
        },
        signal: abort.signal,
        openWhenHidden: true,
      })
      return true
    },
  }
})