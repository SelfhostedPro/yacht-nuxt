<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent :class="[
      fullscreen || isMobile ? 'w-screen h-screen' : 'w-[70vw] h-[70vh]',
      'transition-all duration-200'
    ]">
      <!-- Title bar -->
      <DialogHeader>
        <DialogTitle class="flex justify-between items-center">
          <span>{{ termType }}</span>
          <div class="flex gap-2">
            <slot name="btns" />
            <Button variant="ghost" size="icon" @click="$emit('refresh')" class="relative group">
              <Icon icon="mdi:refresh" class="h-4 w-4" />
              <span class="sr-only">Refresh</span>
            </Button>
            <Button variant="ghost" size="icon" @click="fullscreen = !fullscreen">
              <Icon :icon="fullscreen ? 'mdi:minimize' : 'mdi:maximize'" class="h-4 w-4" />
              <span class="sr-only">Toggle fullscreen</span>
            </Button>
            <Button variant="ghost" size="icon" @click="$emit('close')">
              <Icon icon="mdi:close" class="h-4 w-4" />
              <span class="sr-only">Close</span>
            </Button>
          </div>
        </DialogTitle>
      </DialogHeader>

      <!-- Terminal -->
      <Card ref="terminalCard" class="h-full rounded-none" :class="{ 'opacity-50': !term }">
        <CardContent class="p-0 h-full">
          <!-- xterm will be mounted here -->
        </CardContent>
      </Card>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Terminal } from '@xterm/xterm'
import type { AttachAddon } from '@xterm/addon-attach';
import type { FitAddon } from '@xterm/addon-fit'
import type { Card } from '#ui/app/components/ui/card'
import '@xterm/xterm/css/xterm.css';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')

defineEmits(['close', 'maximize', 'refresh', 'copy'])

// Window Controls
const fullscreen = ref(false)
const terminalCard = ref<HTMLElement | null>(null)
const term = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)

interface Props {
  termType: 'logs' | 'terminal',
  attachAddon?: AttachAddon,
}
const { attachAddon, termType } = defineProps<Props>()

useResizeObserver(terminalCard, () => {
  fitAddon.value?.fit()
})

const loadTermData = async () => {
  if (term.value && attachAddon) {
    term.value.loadAddon(attachAddon)
  }
}

onMounted(async () => {
  const { Terminal } = await import('@xterm/xterm')
  const { FitAddon } = await import('@xterm/addon-fit')
  term.value = new Terminal({
    allowProposedApi: true,
    convertEol: termType === 'logs',
    disableStdin: termType === 'logs'
  })
  fitAddon.value = new FitAddon()
  // Load addons
  term.value.loadAddon(fitAddon.value)
  // Open Terminal and set it as the focus
  term.value.open(terminalCard.value as HTMLElement)
  fitAddon.value.fit()
  term.value.focus()
  loadTermData()
})
</script>
