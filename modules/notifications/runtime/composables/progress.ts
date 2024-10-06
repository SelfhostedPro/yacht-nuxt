import type { Pinia } from 'pinia'
import Progress from '../components/progress.vue'
import { useProgressStore } from '#imports'


// Main function for Progress. Copy and export it
export const useProgress = async (response: ProgressTitleUpdate, component: Component = Progress, options?: any,) => {
    const { $toast, $pinia } = useNuxtApp()
    // Get progress store with active instance
    const progressStore = useProgressStore($pinia)
    const { progress, connected } = storeToRefs(progressStore)
    console.log('from progressts', response.id)

    return $toast.custom(markRaw(component), {
        unstyled: true,
        duration: Number.POSITIVE_INFINITY,
        onAutoClose(toast) {
            progressStore.removeToast(response.id)
        },
        onDismiss(toast) {
            progressStore.removeToast(response.id)
        },
        componentProps: { id: response.id }
    })
}