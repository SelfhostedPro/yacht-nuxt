import type { ImageInfo, NetworkInspectInfo, VolumeInspectInfo } from 'dockerode'
import { defineStore } from 'pinia'
import type { ServerImages, ServerNetworks, ServerVolumes } from '#core/types/servers'

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
    async setResource(
      serverName: string,
      data: unknown,
      resource: 'networks' | 'images' | 'volumes'
    ) {
      if (!this[resource][serverName]) {
        switch (resource) {
          case 'networks':
            this[resource][serverName] = [] as NetworkInspectInfo[]
            break
          case 'images':
            this[resource][serverName] = [] as ImageInfo[]
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

      let idx = -1;
      switch (resource) {
        case 'networks':
          idx = resourceArray.findIndex(
            (item) => (item as NetworkInspectInfo).Id === (data as NetworkInspectInfo).Id
          )
          break
        case 'images':
          idx = resourceArray.findIndex(
            (item) => (item as ImageInfo).Id === (data as ImageInfo).Id
          )
          break
        case 'volumes':
          idx = resourceArray.findIndex(
            (item) => (item as VolumeInspectInfo).Name === (data as VolumeInspectInfo).Name
          )
          break
      }

      if (idx !== -1) {
        switch (resource) {
          case 'networks':
            resourceArray[idx] = data as NetworkInspectInfo
            break
          case 'images':
            resourceArray[idx] = data as ImageInfo
            break
          case 'volumes':
            resourceArray[idx] = data as VolumeInspectInfo
            break
        }
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
      const { error, data, execute, refresh } = await useFetch(
        `/api/resources/${resource}/${server}/${id}`,
        { lazy: true, key: `${resource}-${id}` }
      )

      if (data.value) {
        // First cast to unknown, then to the specific type
        await this.setResource(server, data.value as unknown, resource)
      } else {
        console.log(`${resource} ${id} empty! value:`, data.value)
      }

      if (error.value) {
        console.error(error.value.statusMessage)
      }

      this.stopLoading(resource)
      return { error, data, execute, refresh }
    }
  }
})
