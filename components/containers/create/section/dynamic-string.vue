<template>
  <component :is="getComponent(field.type)" v-model="value" :label="field.label" :items="field.items ?? field.items"
    :placeholder="field.placeholder" :auto-expand="field.type === 'VTextarea'" />
  {{ errorMessage }}
</template>

<script lang="ts" setup>
import { VSelect, VTextField, VTextarea } from "vuetify/components";
const model = defineModel<Field>("field", { required: true });

const getComponent = (type: Field["type"]) => {
  switch (type) {
    case "VSelect":
      return VSelect;
    case "VTextField":
      return VTextField;
    case "VTextarea":
      return VTextarea;
  }
};

export interface Field {
  label: string;
  value: string;
  placeholder?: string;
  items?: string[];
  type: "VTextField" | "VSelect" | "VTextarea";
}
const { value, errorMessage } = useField(() => model.value.value);
</script>

<style></style>