<template>
  <div>
    <v-card-title class="d-flex align-center">
      Environment Variables
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushEnv()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <common-form-dynamic-array path="env" :arrayFields="env" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '~/types/containers/create';
import { type Field } from '~/types/forms'
const { value: form, } = useFormValues<CreateContainerForm>()
// const { xs } = useDisplay()

const env: ComputedRef<Field[][]> = computed(() => {
  return form.env?.map((env, index) => (
    [
      // { label: "Label", value: `env[${index}].label`, placeholder: "Config", type: "label" },
      { label: "name", cols: '4', value: `env[${index}].name`, placeholder: "TZ", type: "VTextField" },
      { label: "value", cols: '8', value: `env[${index}].value`, placeholder: "America/Los_Angeles", type: "VTextField" },
      // { label: "description", cols: `${xs ? 12 : 4}`, value: `env[${index}].description`, type: "description" },
    ]
  )) || []
}
)
const pushEnv = () => {
  // @ts-expect- by leaving name and value undefined, the user will be forced to fill them in
  form.env ? form.env.unshift({ name: '', value: '' }) : form.env = []
}
</script>

<style></style>~/shared/containers/create~/shared/forms