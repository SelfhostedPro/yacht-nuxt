<template>
  <div>
    <component
      :is="field.type === 'VSelect' ? VSelect : field.type === 'VTextField' ? VTextField : null"
      v-model="value"
      :label="field.label"
      :items="field.items ?? field.items"
      :placeholder="field.placeholder"
    />
    {{ errorMessage }}
  </div>
</template>

<script lang="ts" setup>
import { VSelect, VTextField} from 'vuetify/components'
const model = defineModel<Field>('field', {required: true})

export interface Field {
    label: string, 
    value: string, 
    placeholder?: string,
    items?: string[],
    type: 'VTextField' | 'VSelect'
}
const { value, errorMessage } = useField(() => model.value.value);
</script>

<style>

</style>