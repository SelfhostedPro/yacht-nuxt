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
      data.value ? this.servers = data.value : this.servers = {}
    }
  }
})
