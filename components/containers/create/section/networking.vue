<template>
  <div>
    <v-card-title>
      Networking Info
    </v-card-title>
    <v-card-text>
      <containers-create-section-dynamic-string :field="networkModeField" />
    </v-card-text>
    <v-card-title v-if="form.values.network_mode === 'bridge'" class="d-flex align-center">
      Ports
      <v-spacer />
      <v-btn color="primary" class="float-right my-3" @click="pushPortField()">+</v-btn>
    </v-card-title>
    <v-card-text>
      <containers-create-section-dynamic-array :arrayFields="portFields" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from "./dynamic-string.vue";
const portFields: Ref<Field[][]> = ref([]);

// Get form state for displaying ports in the right network mode.
const form = useContainerFormState()

const networkModeField: Field = {
  label: "Network Mode",
  value: "network_mode",
  items: ["bridge", "host", "none"],
  placeholder: "bridge",
  type: "VSelect",
};

const pushPortField = () => {
  portFields.value.unshift([
    { label: "Label", value: `ports[${portFields.value.length}].label`, placeholder: "WebUI", type: "VTextField" },
    { label: "Host", value: `ports[${portFields.value.length}].host`, placeholder: "8080", type: "VTextField" },
    { label: "Container", value: `ports[${portFields.value.length}].container`, placeholder: "80", type: "VTextField" },
    { label: "Protocol", value: `ports[${portFields.value.length}].protocol`, items: ["tcp", "udp"], type: "VSelect" },
  ])
}
</script>

<style></style>