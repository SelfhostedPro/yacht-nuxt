import { defineStore } from 'pinia'
import { boolean } from 'zod'
import type { ThemeSettings } from '~/types/config';
import type { RegisterUserForm } from '~/types/auth';


interface DetailsReturn {
  auth: boolean;
  wizard: boolean;
  theme: ThemeSettings;
}
export const useSettingsStore = defineStore({
  id: 'settingsStore',
  state: () => ({
    details: {} as DetailsReturn,
    loading: [] as string[]
  }),
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    async fetchDetails() {
      this.startLoading('details')
      const { data, error } = await useAsyncData('setting_details', () => $fetch('/api/settings/details'))
      data.value ? this.details = data.value : null
      this.stopLoading('details')
      return { error, data }
    },
    async createInitialUser(form: RegisterUserForm) {
      this.startLoading('create')
      try {
        await $fetch('/api/auth/wizard', { method: 'POST', body: form , })
      } catch (e) {
        console.log(e)
      }
      this.stopLoading('create')
    }
  }
})
