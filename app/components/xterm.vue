
<template>
  <v-dialog scrollable :fullscreen="fullscreen || sm" :max-width="fullscreen || sm ? '100vw' : '70vw'"
    :max-height="fullscreen || sm ? '100vh' : '70vh'" transition="dialog-bottom-transition">
    <template #default>
      <v-card :loading="!term">
        <!-- title bar -->
        <common-title-bar :closable="true" :title="termType" @maximize="fullscreen = !fullscreen" @close="$emit('close')">
          <template v-slot:btns>
            <slot name="btns" />
            <v-tooltip :text="'refresh'">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon @click="$emit('refresh')">
                  <v-icon> mdi-refresh </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
        </common-title-bar>
        <!-- xterm console -->
        <v-card rounded="0" class="fill-height" ref="terminalCard" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { VCard } from 'vuetify/components'
import type { Terminal } from '@xterm/xterm'
import type { AttachAddon } from '@xterm/addon-attach';
import type { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css';

defineEmits(['close', 'maximize', 'refresh', 'copy'])

// Window Controls
const fullscreen: Ref<boolean> = ref(false)
const loading = ref(false)
const { sm } = useDisplay()

const terminalCard: Ref<VCard | null> = useState('terminalRef', () => null)
const term: Ref<Terminal | null> = useState('terminal', () => null)
const fitAddon: Ref<FitAddon | null> = useState('fitAddon', () => null)

interface Props {
  termType: 'logs' | 'terminal',
  attachAddon?: AttachAddon,
}
const { attachAddon, termType } = defineProps<Props>()

useResizeObserver(terminalCard, () => {
  fitAddon.value?.fit()
})

const loadTermData = async () => {
  if (term.value) {
    if (attachAddon) term.value.loadAddon(attachAddon)
  }
}

onMounted(async () => {
  const { Terminal } = await import('@xterm/xterm')
  const { FitAddon } = await import('@xterm/addon-fit')
  term.value = new Terminal({ allowProposedApi: true, convertEol: termType === 'logs', disableStdin: termType === 'logs' })
  fitAddon.value = new FitAddon()
  // Load addons
  term.value.loadAddon(fitAddon.value)
  // Open Terminal and set it as the focus
  term.value.open(terminalCard.value?.$el)
  fitAddon.value.fit()
  term.value.focus()
  loadTermData()
})
</script>

<style></style>