import type { ServerContainers } from '~/types/servers'
import { defineStore, skipHydrate } from 'pinia'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
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
      const { error, data, pending } = await useFetch('/api/containers', { lazy: true, cache: 'no-cache' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading('containers')
      return { error, data }
    },
    async fetchContainerAction(server: string, id: string, action: string) {
      this.startLoading(id)
      const { error, data, pending } = await useFetch(`/api/containers/${server}/action/${id}/${action}`, { lazy: true, cache: 'no-cache' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(id)
      return { error, data }
    }
  }
})