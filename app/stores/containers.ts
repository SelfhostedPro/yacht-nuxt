import type { ServerContainers } from '~~/types/servers'
import type { Container, ContainerStat, ContainerStats } from '~~/types/containers/yachtContainers'
import { defineStore } from 'pinia'
import type { CreateContainerForm } from '~~/types/containers/create'
import { FetchError } from 'ofetch'

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
      const { error, data, refresh, execute } = await useFetch(`/api/containers`, { key: 'container-list' })
      data.value ? this.servers = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading('containers')
      return { error, data, refresh, execute }
    },
    async fetchContainerDetails(server: string, id: string) {
      this.startLoading(id)
      const { error, data, refresh } = await useFetch<Container>(`/api/containers/${server}/${id}`, { key: `container-${id}` })
      data.value ? this.container = data.value : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(id)
      return { error, data, refresh }
    },
    async fetchCreateContainer(form: CreateContainerForm) {
      this.startLoading('create')
      try {
        const data = await $fetch<Container>('/api/containers/', {
          method: 'POST',
          body: form
        })
        this.container = data
        this.stopLoading('create')
        return data
      } catch (e) {
        if (e instanceof FetchError) {
          useNotificationsStore().pushToast(handleDockerErrors(e))
        } else console.error(e)
        this.stopLoading('create')
      }
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