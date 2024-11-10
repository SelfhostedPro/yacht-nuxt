import type { ImageInspectInfo, NetworkInspectInfo, VolumeInspectInfo } from 'dockerode'
import { defineStore } from 'pinia'
import type { ServerImages, ServerNetworks, ServerVolumes } from '~~/types/servers'

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
    async startLoading(name: string) { 
      this.loading.push(name) 
    },
    async stopLoading(name: string) { 
      this.loading = this.loading.filter((item) => item !== name) 
    },
    // Determine type and set resource accordingly
    async setResource(serverName: string, data: NetworkInspectInfo & ImageInspectInfo & VolumeInspectInfo, resource: 'networks' | 'images' | 'volumes') {
      if (!this[resource][serverName]) {
        switch (resource) {
          case 'networks':
            this[resource][serverName] = [] as NetworkInspectInfo[]
            break
          case 'images':
            this[resource][serverName] = [] as ImageInspectInfo[]
            break
          case 'volumes':
            this[resource][serverName] = [] as VolumeInspectInfo[]
            break
        }
      }
      
      const resourceArray = this[resource][serverName]
      if (!Array.isArray(resourceArray)) {
        return
      }

      const idx = resourceArray.findIndex(
        (_resource) => Object.prototype.hasOwnProperty.call(_resource, 'Id')
          ? (_resource as NetworkInspectInfo & ImageInspectInfo).Id === data.Id
          : (_resource as VolumeInspectInfo).Name === data.Name
      )
      
      if (idx !== -1) {
        resourceArray[idx] = data
      }
    },
    async fetchResources(resource: 'networks' | 'images' | 'volumes') {
      this.startLoading(resource)
      const { error, data, execute, refresh } = await useFetch(`/api/resources/${resource}`, { key: `${resource}-list` })
      
      if (data.value) {
        switch (resource) {
          case 'networks':
            this.networks = data.value as ServerNetworks
            break
          case 'images':
            this.images = data.value as ServerImages
            break
          case 'volumes':
            this.volumes = data.value as ServerVolumes
            break
        }
      } else {
        console.log(`${resource} empty! value:`, data.value)
      }
      
      if (error.value) {
        console.error(error.value.statusMessage)
      }
      
      this.stopLoading(resource)
      return { error, data, execute, refresh }
    },
    async fetchResource(resource: 'networks' | 'images' | 'volumes', server: string, id: string) {
      this.startLoading(resource)
      const { error, data, execute, refresh } = await useFetch(`/api/resources/${resource}/${server}/${id}`, { lazy: true, key: `${resource}-${id}` })
      
      if (data.value) {
        await this.setResource(server, (data.value as NetworkInspectInfo & ImageInspectInfo & VolumeInspectInfo), resource)
      } else {
        console.log(`${resource} ${id} empty! value:`, data.value)
      }
      
      if (error.value) {
        console.error(error.value.statusMessage)
      }
      
      this.stopLoading(resource)
      return { error, data, execute, refresh }
    },
  }
})
