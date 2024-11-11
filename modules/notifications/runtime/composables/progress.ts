import type { Component } from 'vue'
import { markRaw } from 'vue'
import type { ProgressTitleUpdate } from '~~/modules/notifications/types/progress'
import Progress from '../components/progress.vue'
import { useProgressStore, useNuxtApp } from '#imports'

interface ProgressOptions {
  [key: string]: unknown
}

type ProgressFunction = (
  response: ProgressTitleUpdate,
  component?: Component,
  options?: ProgressOptions
) => Promise<unknown>

// Main function for Progress
export const useProgress: ProgressFunction = async (
  response: ProgressTitleUpdate, 
  component: Component = Progress,
  _options?: ProgressOptions
): Promise<unknown> => {
    const { $toast, $pinia } = useNuxtApp()
    
    // Get progress store with active instance
    const progressStore = useProgressStore($pinia)
    
    return $toast.custom(markRaw(component), {
        unstyled: true,
        duration: Number.POSITIVE_INFINITY,
        onAutoClose(_toast) {
            progressStore.removeToast(response.id)
        },
        onDismiss(_toast) {
            progressStore.removeToast(response.id)
        },
        componentProps: { id: response.id }
    })
}
