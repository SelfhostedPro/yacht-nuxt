import type { ServerContainers } from '~/types/servers'
import type { ContainerStats } from '~/types/containers/yachtContainers'
import { defineStore } from 'pinia'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
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
      const { error, data } = await useFetch('/api/containers', { lazy: true, cache: 'no-cache' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading('containers')
      return { error, data }
    },
    async fetchContainerAction(server: string, id: string, action: string) {
      this.startLoading(id)
      const { error, data } = await useFetch(`/api/containers/${server}/${id}/${action}`, { lazy: true, cache: 'no-cache' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(id)
      return { error, data }
    },
    async fetchContainerStats() {
      this.startLoading('stats')
      const abort = new AbortController()
      const self = this
      useSse('/api/containers/stats', {
        async onopen(response) {
          if (response.ok) {
            console.log('Connected to stats SSE')
            self.stopLoading('stats')
          } else {
            console.log('Failed to connect to stats SSE')
          }
        },
        async onmessage(event) {
          const stat = JSON.parse(JSON.parse(event.data))
          self.stats[stat.name] = stat
        },
        signal: abort.signal
      })
    }
  }
})