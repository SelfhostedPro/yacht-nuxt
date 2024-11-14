<template>
  <div v-bind="$attrs" class="flex items-center justify-between p-2 border-b">
    <div class="text-lg font-semibold">
      {{ title || null }}
    </div>
    <div class="flex items-center space-x-2">
      <slot name="btns" />
      <TooltipProvider v-if="closable">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" @click="$emit('maximize')">
              <Maximize2 class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Maximize
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button v-if="closable" variant="ghost" size="icon" @click="$emit('close')">
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Maximize2, X } from 'lucide-vue-next'
defineEmits(['close', 'maximize'])

interface Props {
  closable?: boolean
  title?: string
  color?: string
  name?: string
}

defineProps<Props>()

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
</script>
