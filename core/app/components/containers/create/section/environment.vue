<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">Environment Variables</h3>
      <Button variant="default" size="sm" @click="pushEnv()">
        <span class="sr-only">Add environment variable</span>
        <span class="h-4 w-4">+</span>
      </Button>
    </div>
    <div class="space-y-4">
      <common-form-dynamic-array path="env" :array-fields="env" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '#docker/types/containers/create';
import type { Field } from '#core/types/forms';

const { value: form } = useFormValues<CreateContainerForm>();

const env: ComputedRef<Field[][]> = computed(() => {
  return form.env?.map((env, index) => ([
    {
      label: "name",
      name: `env_name_${index}`,
      cols: '4',
      value: `env[${index}].name`,
      placeholder: "TZ",
      type: "input"
    },
    {
      label: "value",
      name: `env_value_${index}`,
      cols: '8',
      value: `env[${index}].value`,
      placeholder: "America/Los_Angeles",
      type: "input"
    },
  ])) || []
});

const pushEnv = () => {
  if (!form.env) {
    form.env = [{ name: '', value: '' }];
  } else {
    form.env.unshift({ name: '', value: '' });
  }
};
</script>
