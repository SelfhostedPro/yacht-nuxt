<template>
  <v-card
    color="foreground"
    width="80vw"
    height="80vh"
  >
    <common-title-bar
      class="form-bar"
      :loading="loading"
      color="primary"
      :closable="true"
      :title="`create ${form.name || 'new app'}`"
      @maximize="$emit('maximize')"
      @close="$emit('close')"
    />
    <containers-create-form v-model:form="form" />
  </v-card>
</template>

<script setup lang="ts">
import { type YachtTemplate } from '~/types/templates/yacht';
const loading = ref(false)

interface Props {
  template?: YachtTemplate,
  maximize: boolean
}
defineProps<Props>()
defineEmits(['close', 'maximize'])

const form = useContainerFormState().value.values

</script>
<style></style>