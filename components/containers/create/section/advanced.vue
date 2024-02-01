<template>
  <div>
    <v-card-title class="d-flex align-center">
      Advanced
      <v-spacer />
    </v-card-title>
    <v-expansion-panels variant="popout" multiple v-model="panelsOpen" title="command">

      <v-expansion-panel title="command">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom commands to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushCommandField()">+</v-btn>
          </div>
          <common-form-dynamic-array :arrayFields="commandField" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="labels">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom labels to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushLabelField()">+</v-btn>
          </div>
          <common-form-dynamic-array :arrayFields="labelsField" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="sysctls">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom sysctls to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushSysctls()">+</v-btn>
          </div>
          <common-form-dynamic-array :arrayFields="sysctlFields" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="devices">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom devices to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushDeviceField()">+</v-btn>
          </div>
          <common-form-dynamic-array :arrayFields="deviceFields" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="capabilities">
        <v-expansion-panel-text>
          <v-card-text>
            Add or drop custom capabilities for your container.
          </v-card-text>
          <v-card-text>Add</v-card-text>
          <common-form-dynamic-string :field="capAddField" />
          <v-card-text>Drop</v-card-text>
          <common-form-dynamic-string :field="capDropField" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="limits">
        <v-expansion-panel-text>
          <v-card-text>
            Add custom commands to your container.
          </v-card-text>
          <v-card-text>CPU</v-card-text>
          <common-form-dynamic-string :field="cpuLimitsField" />
          <v-card-text>Memory</v-card-text>
          <common-form-dynamic-string :field="memoryLimitsField" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts" setup>

import { type Field } from '~/types/forms'
const commandField: Ref<Field[][]> = ref([]);
const labelsField: Ref<Field[][]> = ref([]);
const sysctlFields: Ref<Field[][]> = ref([]);
const deviceFields: Ref<Field[][]> = ref([]);
const panelsOpen = ref([])
const { xs } = useDisplay()
const pushCommandField = () => {
  commandField.value.push([
    { label: "Command", value: `command[${commandField.value.length}]`, placeholder: "/bin/sh", cols: "12", type: "VTextField" },
  ])
}
const pushLabelField = () => {
  labelsField.value.unshift([
    { label: "name", cols: '6', value: `labels[${labelsField.value.length}].name`, placeholder: "TZ", type: "VTextField" },
    { label: "value", cols: '6', value: `labels[${labelsField.value.length}].value`, placeholder: "America/Los_Angeles", type: "VTextField" },
  ])
}
const pushSysctls = () => {
  sysctlFields.value.unshift([
    { label: "name", value: `sysctls[${sysctlFields.value.length}].name`, placeholder: "net.ipv6.conf.all.disable_ipv6", cols: "12", type: "VTextField" },
    { label: "value", value: `sysctls[${sysctlFields.value.length}].value`, placeholder: "1", cols: "12", type: "VTextField" },
  ])
}
const pushDeviceField = () => {
  deviceFields.value.unshift([
    { label: "host", value: `devices[${deviceFields.value.length}].name`, placeholder: "name", cols: "12", type: "VTextField" },
    { label: "container", value: `devices[${deviceFields.value.length}].path`, placeholder: "path", cols: "8", type: "VTextField" },
    { label: "permissions", value: `devices[${deviceFields.value.length}].permissions`, placeholder: "rwm", items: ['r', 'w', 'm', 'mw', 'rm', 'rwm', 'rw'], cols: "4", type: "VSelect" },
  ])
}
const capAddField: Field = {
  label: "capability",
  value: `capabilities.add`,
  placeholder: "SYS_ADMIN",
  multiple: true,
  items: [
    "SYS_MODULE",
    "SYS_RAWIO",
    "SYS_PACCT",
    "SYS_ADMIN",
    "SYS_NICE",
    "SYS_RESOURCE",
    "SYS_TIME",
    "SYS_TTY_CONFIG",
    "AUDIT_CONTROL",
    "MAC_ADMIN",
    "MAC_OVERRIDE",
    "NET_ADMIN",
    "SYSLOG",
    "DAC_READ_SEARCH",
    "LINUX_IMMUTABLE",
    "NET_BROADCAST",
    "IPC_LOCK",
    "IPC_OWNER",
    "SYS_PTRACE",
    "SYS_BOOT",
    "LEASE",
    "WAKE_ALARM",
    "BLOCK_SUSPEND"
  ],
  cols: "12",
  type: "VSelect"
}
const capDropField: Field = {
  label: "capability",
  value: `capabilities.drop`,
  placeholder: "KILL",
  multiple: true,
  items: [
    "AUDIT_WRITE",
    "CHOWN",
    "DAC_OVERRIDE",
    "FOWNER",
    "FSETID",
    "KILL",
    "SETGID",
    "SETUID",
    "SETPCAP",
    "NET_BIND_SERVICE",
    "NET_RAW",
    "SYS_CHROOT",
  ],
  cols: "12",
  type: "VSelect"
}

const cpuLimitsField: Field = {
  label: "CPU",
  value: `limits.cpu`,
  placeholder: "1",
  cols: "12",
  type: "VTextField"
}
const memoryLimitsField: Field = {
  label: "Memory",
  value: `limits.memory`,
  placeholder: "1000b | 100k | 10m | 1g",
  cols: "12",
  type: "VTextField"
}
</script>

<style></style>