<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium">Networking</h3>
    </div>

    <div>
      <Form>
        <FormField v-slot="{ componentField }" name="network_mode">
          <FormItem>
            <FormLabel>Network Mode</FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="bridge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="mode in ['bridge', 'host', 'none']" 
                             :key="mode" 
                             :value="mode">
                    {{ mode }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </Form>
    </div>

    <div v-if="form.network_mode === 'bridge'" class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-base font-medium">Ports</h4>
        <Button variant="default" size="sm" @click="pushPort()">
          <span class="sr-only">Add port</span>
          <span class="h-4 w-4">+</span>
        </Button>
      </div>

      <common-form-dynamic-array path="ports" :array-fields="ports" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from '#core/types/forms'
import type { CreateContainerForm } from '#docker/types/containers/create';

const { value: form } = useFormValues<CreateContainerForm>();

const networkModeField: Field = {
  label: "Network Mode",
  name: "network_mode",
  value: "network_mode",
  items: ["bridge", "host", "none"],
  placeholder: "bridge",
  type: "select",
};

const ports: ComputedRef<Field[][]> = computed(() => {
  return form.ports?.map((port, index) => ([
    {
      label: "Label",
      name: `port_label_${index}`,
      value: `ports[${index}].label`,
      placeholder: "WebUI",
      type: "input"
    },
    {
      label: "Host",
      name: `port_host_${index}`,
      value: `ports[${index}].host`,
      placeholder: "8080",
      type: "input"
    },
    {
      label: "Container",
      name: `port_container_${index}`,
      value: `ports[${index}].container`,
      placeholder: "80",
      type: "input"
    },
    {
      label: "Protocol",
      name: `port_protocol_${index}`,
      value: `ports[${index}].protocol`,
      items: ["tcp", "udp"],
      type: "select"
    },
    {
      label: "description",
      name: `port_description_${index}`,
      value: `ports[${index}].description`,
      type: "description"
    }
  ])) || []
});

const pushPort = () => {
  if (!form.ports) {
    form.ports = []
  }
  form.ports.unshift({ label: undefined, host: undefined, container: undefined, protocol: undefined })
};
</script>
