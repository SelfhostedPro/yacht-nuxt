<template>
  <div>
    <Label v-if="field.type === 'label' && value">
      {{ value }}
    </Label>

    <FormField
      v-else-if="field.type !== 'button' && field.type !== 'description'"
      v-slot="{ componentField }"
      :name="field.name"
    >
      <FormItem v-auto-animate>
        <FormLabel>{{ field.label }}</FormLabel>
        <FormControl>
          <component
            :is="getComponent(field.type)"
            v-bind="componentField"
            :placeholder="field.placeholder"
            :multiple="field.multiple"
            :options="field.items"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button
      v-else-if="field.type === 'button'"
      v-model="value"
      @click="value = !value"
    >
      <template v-if="field.icons">
        <Icon
          :name="value ? field.icons[0] : field.icons[1]"
          class="mr-2 h-4 w-4"
        />
      </template>
      {{ field.label }}
    </Button>

    <Alert
      v-else-if="field.type === 'description' && value"
      variant="info"
    >
      {{ value }}
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from "#core/types/forms";
import { Input } from '#ui/app/components/ui/input'
import { Select } from '#ui/app/components/ui/select'
import { Textarea } from '#ui/app/components/ui/textarea'
import { Button } from '#ui/app/components/ui/button'
import { Switch } from '#ui/app/components/ui/switch'

const model = defineModel<Field>("field", { required: true });

const getComponent = (type: Field["type"]) => {
  switch (type) {
    case "select":
      return Select;
    case "textarea":
      return Textarea;
    case "button":
      return Button;
    case "input":
      return Input;
    case "switch":
      return Switch
    default:
      return Input;
  }
};

const { handleSubmit } = useForm({
  initialValues: {
    [model.value.name]: model.value.value ?? "",
  },
  validateOnMount: model.value.validateOnMount,
});

const { value, errorMessage } = useField(model.value.name);
</script>
