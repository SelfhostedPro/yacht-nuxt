import type { ServerContainers } from '~/types/servers'
import type { Container, ContainerStat, ContainerStats } from '~/types/containers/yachtContainers'
import { defineStore } from 'pinia'
import type { CreateContainerForm } from '~/types/containers/create'

export const useContainersStore = defineStore({
  id: 'containersStore',
  state: () => ({
    servers: {} as ServerContainers,
    container: {} as Container,
    // stats: {} as ContainerStats,
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
      try {
        const data = await $fetch<ServerContainers>('/api/containers')
        this.stopLoading('containers')
        data ? this.servers = data : null
        return data
      } catch (e) {
        this.stopLoading('containers')
        return e
      }
    },
    async fetchContainerDetails(server: string, id: string) {
      this.startLoading(id)
      try {
        const data = await $fetch<Container>(`/api/containers/${server}/${id}`)
        this.stopLoading(id)
        if (data) this.container = data
        return data
      } catch (e) {
        this.stopLoading(id)
        console.error('error getting container details', e)
        return e
      }
    },
    async fetchCreateContainer(form: CreateContainerForm) {
      this.startLoading('create')
      const { error, data } = await useFetch<Container>(`/api/containers/`, {
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
      try {
        const data = await $fetch<ServerContainers>(`/api/containers/${server}/${id}/actions/${action}`, { method: 'POST' })
        this.stopLoading(id)
        if (data) this.servers = data
        return { data }
      } catch (e) {
        this.stopLoading(id)
        console.error(`error calling server action`, e)
      }
    },
  }
})