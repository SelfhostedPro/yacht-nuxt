<template>
  <div>
    <v-card-title>
      Storage
    </v-card-title>
    <v-card-title class="d-flex align-center">
      Mounts
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushStorageField()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <containers-create-section-dynamic-array :arrayFields="storageFields" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from './dynamic-string.vue'
const storageFields: Ref<Field[][]> = ref([]);

const pushStorageField = () => {
  storageFields.value.unshift([
    { label: "Label", value: `mounts[${storageFields.value.length}].label`, placeholder: "WebUI", type: "VTextField" },
    { label: "Source", cols: '5', value: `mounts[${storageFields.value.length}].source`, placeholder: "8080", type: "VTextField" },
    { label: "Destination", cols: '5', value: `mounts[${storageFields.value.length}].destination`, placeholder: "80", type: "VTextField" },
    { label: "ro", value: `mounts[${storageFields.value.length}].read_only`, icons: ['mdi-lock', 'mdi-lock-open'], cols: 2, items: [true, false], type: "VBtnToggle" },
  ])
}
</script>

<style></style>