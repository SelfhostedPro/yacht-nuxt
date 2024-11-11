import { defineStore } from 'pinia'
// import { ThemeSettingsSchema, type RegisterUserForm, type ThemeSettings  } from '#imports'
import type { YachtConfig, } from '#config/types'
import type { ThemeSettingsSchema } from '#config/types/theme'
import type { RegisterUserFormSchema } from "#auth/types/auth"
import type { z } from 'zod'
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
    loading: [] as string[]
  }),
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    async fetchDetails() {
      this.startLoading('details')
      const { data, error } = await useAsyncData('setting_details', () => $fetch<{ auth: boolean, theme: YachtConfig['theme'], wizard: boolean, name: string }>('/api/settings/details'))
      this.details = data.value ?? this.details
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
    }
  }
})
