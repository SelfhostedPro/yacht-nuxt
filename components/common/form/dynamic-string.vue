<template>
  <div>
    <component v-bind="$attrs" v-if="field.type !== 'VBtnToggle'" :clearable="field.multiple ?? true"
      :multiple="field.multiple ?? field.multiple" :hide-details="true" :is="getComponent(field.type)" v-model="value"
      :label="field.label" :items="field.items ?? field.items" :placeholder="field.placeholder"
      :auto-expand="field.type === 'VTextarea'" />
    <component v-bind="$attrs" v-else color="primary" :is="getComponent(field.type)" v-model="value"
      :label="field.label" @click="value = !value">
      <v-icon v-if="field.icons" :icon="value ? field.icons[0] : field.icons[1]" /> {{ field.label }}
    </component>
  </div>
</template>

<script lang="ts" setup>
import { VSelect, VTextField, VTextarea, VBtn } from "vuetify/components";
import { type Field } from '~/types/forms'
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

const { value, errorMessage } = useField(() => model.value.value);
</script>

<style></style>