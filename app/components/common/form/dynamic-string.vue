<template>
  <div>
    <v-card-title v-if="field.type === 'label' && value" type="info">
      {{ value }}
    </v-card-title>
    <component
      v-bind="$attrs"
      v-else-if="field.type !== 'VBtnToggle' && field.type !== 'description'"
      :clearable="field.multiple ? true : false"
      :multiple="field.multiple ?? field.multiple"
      :hide-details="errorMessage ? false : true"
      :is="getComponent(field.type)"
      v-model="value"
      :label="field.label"
      :items="field.items ?? field.items"
      :placeholder="field.placeholder"
      :auto-expand="field.type === 'VTextarea'"
      :error-messages="errorMessage"
    />
    <component
      v-bind="$attrs"
      v-else-if="field.type === 'VBtnToggle'"
      color="primary"
      :is="getComponent(field.type)"
      v-model="value"
      :label="field.label"
      @click="value = !value"
    >
      <v-icon
        v-if="field.icons"
        :icon="value ? field.icons[0] : field.icons[1]"
      />
      {{ field.label }}
    </component>
    <v-alert
      color="primary"
      v-else-if="field.type === 'description' && value"
      type="info"
    >
      <v-card-text>{{ value }}</v-card-text>
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import { VSelect, VTextField, VTextarea, VBtn } from "vuetify/components";
import { type Field } from "~/types/forms";
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

const { value, errorMessage } = useField(
  () => model.value.value,
  {},
  {
    validateOnMount: model.value.validateOnMount,
    validateOnValueUpdate: model.value.validateOnMount,
  }
);
</script>

<style></style>
~/shared/forms
