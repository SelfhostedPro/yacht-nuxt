<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium">Storage</h3>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-base font-medium">Mounts</h4>
        <Button variant="default" size="sm" @click="pushMount()">
          <span class="sr-only">Add mount</span>
          <span class="h-4 w-4">+</span>
        </Button>
      </div>

      <div class="space-y-4">
        <common-form-dynamic-array path="mounts" :array-fields="mounts" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '#docker/types/containers/create';
import type { Field } from '#core/types/forms';

const { value: form } = useFormValues<CreateContainerForm>();

const mounts: ComputedRef<Field[][]> = computed(() => {
  return form.mounts?.map((mount, index) => ([
    {
      label: "Label",
      name: `mount_label_${index}`,
      value: `mounts[${index}].label`,
      placeholder: "WebUI",
      type: "input"
    },
    {
      label: "Source",
      name: `mount_source_${index}`,
      cols: '5',
      value: `mounts[${index}].source`,
      placeholder: "8080",
      type: "input"
    },
    {
      label: "Destination",
      name: `mount_destination_${index}`,
      cols: '5',
      value: `mounts[${index}].destination`,
      placeholder: "80",
      type: "input"
    },
    {
      label: "Read Only",
      name: `mount_readonly_${index}`,
      value: `mounts[${index}].read_only`,
      type: "switch"
    }
  ])) || []
});

const pushMount = () => {
  form.mounts = form.mounts || []
  form.mounts.unshift({ label: '', source: '', destination: '', read_only: false })
};
</script>
