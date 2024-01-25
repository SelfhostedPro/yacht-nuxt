<template>
  <v-card color="foreground" class="overflow-y-auto" width="80vw" height="100%">
    <common-title-bar class="form-bar" :loading="loading" color="primary" :closable="true"
      :title="`create ${form.values.name || 'new app'}`" @maximize="$emit('maximize')" @close="$emit('close')" />
    <containers-create-form />
    <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
      <v-spacer />
      <v-btn v-if="step !== 0" @click="step--">
        prev
      </v-btn>
      <v-btn v-if="step !== 6" color="primary" @click="step++">
        next
      </v-btn>
      <v-btn v-else color="primary">
        submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { type YachtTemplate } from '~/types/templates/yacht';
const loading = ref(false)
const step = useState('containerFormStep', () => 0)

const form = useContainerFormState()

interface Props {
  template?: YachtTemplate,
  maximize: boolean
}
defineProps<Props>()
defineEmits(['close', 'maximize'])

</script>
<style></style>