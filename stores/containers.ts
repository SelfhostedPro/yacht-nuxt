import type { ServerContainers } from '~/types/servers'
import { defineStore } from 'pinia'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
    loading: false
  }),
  getters: {
    getContainers: (state) => state.servers,
  },
  actions: {
    async fetchContainers() {
      const { error, data, pending } = await useFetch('/api/containers', { lazy: true })
      this.loading = pending.value
      if (error.value) console.error(error.value.statusMessage); else data.value && typeof data.value !== 'string' ? this.servers = data.value : this.servers = {}
    }
  }
})
