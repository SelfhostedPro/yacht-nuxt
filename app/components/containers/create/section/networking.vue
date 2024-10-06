<template>
  <div>
    <v-card-title>
      Networking
    </v-card-title>
    <v-card-text>
      <common-form-dynamic-string :field="networkModeField" />
    </v-card-text>
    <v-slide-y-transition group>
      <v-card-title v-if="form.network_mode === 'bridge'" class="d-flex align-center">
        Ports
        <v-spacer />
        <v-btn color="primary" class="float-right my-3" @click="pushPort()">+</v-btn>
      </v-card-title>
    </v-slide-y-transition>
    <v-card-text v-if="form.network_mode === 'bridge'">
      <common-form-dynamic-array path="ports" :arrayFields="ports" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import { type Field } from '~/types/forms'
import type { CreateContainerForm } from '~/types/containers/create';

const { value: form } = useFormValues<CreateContainerForm>()

const networkModeField: Field = {
  label: "Network Mode",
  value: "network_mode",
  items: ["bridge", "host", "none"],
  placeholder: "bridge",
  type: "VSelect",
};

const ports: ComputedRef<Field[][]> = computed(() => {
  return form.ports?.map((port, index) => (
    [{ label: "Label", value: `ports[${index}].label`, placeholder: "WebUI", type: "VTextField" },
    { label: "Host", value: `ports[${index}].host`, placeholder: "8080", type: "VTextField" },
    { label: "Container", value: `ports[${index}].container`, placeholder: "80", type: "VTextField" },
    { label: "Protocol", value: `ports[${index}].protocol`, items: ["tcp", "udp"], type: "VSelect" },
    { label: "description", value: `ports[${index}].description`, type: "description" },]
  )) || []
})
const pushPort = () => {
  form.ports ? form.ports.unshift({ label: undefined, host: undefined, container: undefined, protocol: undefined }) : form.ports = []
}
</script>

<style></style>~/shared/forms~/shared/containers/create