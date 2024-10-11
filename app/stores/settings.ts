import { defineStore } from 'pinia'
// import { ThemeSettingsSchema, type RegisterUserForm, type ThemeSettings  } from '#imports'
import { RegisterUserFormSchema, ThemeSettingsSchema, type YachtConfig } from '#imports'
import { z } from 'zod'
import type { DBUser } from '~~/modules/db/types/user'
import type { NewServer } from '~~/types/servers'
type ThemeSettings = z.infer<typeof ThemeSettingsSchema>
type RegisterUserForm = z.infer<typeof RegisterUserFormSchema>

interface DetailsReturn {
  auth: boolean;
  wizard: boolean;
  theme: ThemeSettings;
  name: string;
}
export const useSettingsStore = defineStore({
  id: 'settingsStore',
  state: () => ({
    details: {} as DetailsReturn,
    loading: [] as string[],
    settings: {} as YachtConfig,
    users: [] as DBUser[],
    keys: [] as YachtConfig['servers'][0]["key"][]
  }),
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    async fetchDetails() {
      this.startLoading('details')
      const { data, error } = await useAsyncData('setting_details', () => $fetch<{ auth: boolean, theme: any, wizard: boolean, name: string }>('/api/settings/details'))
      data.value ? this.details = data.value : null
      this.stopLoading('details')
      return { error, data }
    },
    async createInitialUser(form: RegisterUserForm) {
      this.startLoading('create')
      try {
        await $fetch('/api/auth/wizard', { method: 'POST', body: form, })
      } catch (e) {
        console.log(e)
      }
      this.stopLoading('create')
    },
    async fetchSettings() {
      this.startLoading('settings')
      const { error, data } = await useFetch<YachtConfig>('/api/settings')
      if (!error.value && data.value) {
        this.settings = data.value
        this.stopLoading('settings')
      } else {
        this.stopLoading('settings')
        throw Error('Unable to get settings!!!')
      }
    },
    async fetchKeys() {
      this.startLoading('keys')
      const { error, data } = await useFetch(`/api/settings/keys`)
      if (!error.value && data.value) {
        this.keys = data.value
        this.stopLoading('keys')
      }
      this.stopLoading('keys')
    },
    async addServer(form: NewServer) {
      this.startLoading('servers')
      const data = await $fetch<YachtConfig>(`/api/settings/servers/`, { method: "POST", body: form })
      if (data) {
        this.settings.servers = data.servers
        this.stopLoading('servers')
      }
      this.stopLoading('servers')
    },
    async removeServer(name: string, removeRemoteKey: boolean, removeLocalKey: boolean) {
      this.startLoading('servers')
      const { error, data } = await useFetch<YachtConfig['servers']>(`/api/settings/servers/`, { method: "DELETE", body: { name, removeRemoteKey, removeLocalKey } })
      if (!error.value && data.value) {
        this.settings.servers = data.value
        this.stopLoading('servers')
      } else {
        this.stopLoading('servers')
      }
    }
  }
})
