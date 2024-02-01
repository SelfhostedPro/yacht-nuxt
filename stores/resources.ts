import type { ImageInspectInfo, NetworkInspectInfo, VolumeInspectInfo } from 'dockerode'
import { defineStore } from 'pinia'
import type { ServerImages, ServerNetworks, ServerVolumes } from '~/types/servers'

export const useResourcesStore = defineStore({
  id: 'ResourcesStore',
  state: () => ({
    networks: {} as ServerNetworks,
    images: {} as ServerImages,
    volumes: {} as ServerVolumes,
    loading: [] as string[],
  }),
  getters: {},
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    // Determine type and set resource accordingly
    async setResource(serverName: string, data: NetworkInspectInfo & ImageInspectInfo & VolumeInspectInfo, resource: 'networks' | 'images' | 'volumes') {
      const idx = this[resource][serverName].findIndex(
        (_resource) => _resource.hasOwnProperty('Id')
          ? (_resource as NetworkInspectInfo & ImageInspectInfo).Id === data.Id
          : (_resource as VolumeInspectInfo).Name === data.Name)
      this[resource][serverName][idx] = data
    },
    async fetchResources(resource: 'networks' | 'images' | 'volumes') {
      this.startLoading(resource)
      const { error, data } = await useFetch(`/api/resources/${resource}`)
      data.value ? this[resource] = data.value as ServerNetworks & ServerImages & ServerVolumes : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(resource)
      return { error, data }
    },
    async fetchResource(resource: 'networks' | 'images' | 'volumes', server: string, id: string) {
      this.startLoading(resource)
      const { error, data } = await useFetch(`/api/resources/${resource}/${server}/${id}`)
      data.value ? this.setResource(server, (data.value as NetworkInspectInfo & ImageInspectInfo & VolumeInspectInfo), resource) : console.log(data.value)
      if (error.value) console.error(error.value.statusMessage)
      this.stopLoading(resource)
      return { error, data }
    },
  }
})
