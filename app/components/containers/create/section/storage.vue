<template>
  <div>
    <v-card-title>
      Storage
    </v-card-title>
    <v-card-title class="d-flex align-center">
      Mounts
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushMount()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <common-form-dynamic-array path="mounts" :arrayFields="mounts" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '~/types/containers/create';
import { type Field } from '~/types/forms'
const { value: form } = useFormValues<CreateContainerForm>()

const mounts: ComputedRef<Field[][]> = computed(() => {
  return form.mounts?.map((mount, index) => (
    [{ label: "Label", value: `mounts[${index}].label`, placeholder: "WebUI", type: "VTextField" },
    { label: "Source", cols: '5', value: `mounts[${index}].source`, placeholder: "8080", type: "VTextField" },
    { label: "Destination", cols: '5', value: `mounts[${index}].destination`, placeholder: "80", type: "VTextField" },
    { label: "ro", value: `mounts[${index}].read_only`, icons: ['mdi-lock', 'mdi-lock-open'], cols: 2, items: [true, false], type: "VBtnToggle" },]
  )) || []
}
)
const pushMount = () => {
  form.mounts ? form.mounts.unshift({ label: '', source: '', destination: '', read_only: false }) : form.mounts = []
}
</script>

<style></style>~/shared/containers/create~/shared/forms