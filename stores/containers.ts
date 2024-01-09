import type { ServerContainers } from '~/types/servers'
import { defineStore, skipHydrate } from 'pinia'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
    loading: true,
  }),
  getters: {
    getContainers: (state) => state.servers,
  },
  actions: {
    async fetchContainers() {
      this.loading = true
      const { error, data, pending } = await useFetch('/api/containers', { lazy: true, cache: 'no-cache' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.loading = false
      return { error, data }
    }
  }
})