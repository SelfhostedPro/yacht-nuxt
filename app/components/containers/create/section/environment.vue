<template>
  <div>
    <v-card-title class="d-flex align-center">
      Environment Variables
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushEnv()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <common-form-dynamic-array path="env" :array-fields="env" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '~~/types/containers/create';
import type { Field } from '~~/types/forms'
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
  if (!form.env) {
    form.env = [{ name: '', value: '' }]
  } else {
    form.env.unshift({ name: '', value: '' })
  }
}
</script>

<style></style>~/shared/containers/create~/shared/forms