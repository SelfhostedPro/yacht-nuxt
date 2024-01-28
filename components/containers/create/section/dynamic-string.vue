<template>
  <div>
    <component v-if="field.type !== 'VBtnToggle'" :hide-details="true" :is="getComponent(field.type)" v-model="value" :label="field.label"
      :items="field.items ?? field.items" :placeholder="field.placeholder" :auto-expand="field.type === 'VTextarea'" />
    <component v-else color="primary" :is="getComponent(field.type)" v-model="value" :label="field.label"
      @click="value = !value">
      <v-icon v-if="field.icons" :icon="value ? field.icons[0] : field.icons[1]" /> {{ field.label }}
    </component>
    {{ errorMessage }}
  </div>
</template>

<script lang="ts" setup>
import { VSelect, VTextField, VTextarea, VBtn } from "vuetify/components";
const model = defineModel<Field>("field", { required: true });

const getComponent = (type: Field["type"]) => {
  switch (type) {
    case "VSelect":
      return VSelect;
    case "VTextField":
      return VTextField;
    case "VTextarea":
      return VTextarea;
    case "VBtn":
      return VBtn;
    case "VBtnToggle":
      return VBtn;
  }
};

export interface Field {
  label: string;
  value: string;
  placeholder?: string;
  items?: string[] | boolean[];
  icons?: string[];
  cols?: number | string;
  type: "VTextField" | "VSelect" | "VTextarea" | "VBtn" | "VBtnToggle";
}
const { value, errorMessage } = useField(() => model.value.value);
</script>

<style></style>