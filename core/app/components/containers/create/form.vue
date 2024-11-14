<template>
  <div class="h-full">
    <div class="grid h-full" :class="smAndDown ? 'grid-cols-1' : 'grid-cols-[1fr_3fr]'">
      <!-- Form Progress -->
      <div :class="[
        'bg-background', 
        !smAndDown ? 'h-full overflow-y-auto border-r' : ''
      ]">
        <div class="flex items-start justify-start p-4">
          <containers-create-progress v-model:step="step" />
        </div>
      </div>

      <!-- Form Fields -->
      <div class="h-full">
        <div class="h-full">
          <div v-for="(section, i) in sections" 
               :key="i" 
               class="h-full overflow-y-auto"
               v-show="step === i">
            <Card class="mx-auto my-auto border-0 rounded-none bg-card">
              <CardContent>
                <component :is="section" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  ContainersCreateSectionBase,
  ContainersCreateSectionInfo,
  ContainersCreateSectionNetworking,
  ContainersCreateSectionStorage,
  ContainersCreateSectionEnvironment,
  ContainersCreateSectionAdvanced,
  ContainersCreateSectionPreview
} from '#components'

// Replace Vuetify's useDisplay with vueuse's useMediaQuery
const smAndDown = useMediaQuery('(max-width: 960px)')
const step = useState('containerFormStep', () => 0)

const sections = [
  ContainersCreateSectionBase,
  ContainersCreateSectionInfo,
  ContainersCreateSectionNetworking,
  ContainersCreateSectionStorage,
  ContainersCreateSectionEnvironment,
  ContainersCreateSectionAdvanced,
  ContainersCreateSectionPreview
]
</script>
