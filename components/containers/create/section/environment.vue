<template>
  <div>
    <v-card-title class="d-flex align-center">
      Environment Variables
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushStorageField()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <common-form-dynamic-array :arrayFields="storageFields" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import { type Field} from '~/types/forms'
const storageFields: Ref<Field[][]> = ref([]);
const { xs } = useDisplay()
const pushStorageField = () => {
  storageFields.value.unshift([
    { label: "Label", value: `env[${storageFields.value.length}].label`, placeholder: "WebUI", type: "VTextField" },
    { label: "description", cols:`${xs ? 12 : 4}`, value: `env[${storageFields.value.length}].description`, type: "VTextField" },
    { label: "name", cols: '4', value: `env[${storageFields.value.length}].name`, placeholder: "TZ", type: "VTextField" },
    { label: "value", cols: '8', value: `env[${storageFields.value.length}].value`, placeholder: "America/Los_Angeles", type: "VTextField" },
  ])
}
</script>

<style></style>