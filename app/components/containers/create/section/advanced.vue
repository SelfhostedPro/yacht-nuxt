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
          <common-form-dynamic-array path="command" :arrayFields="commands" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="labels">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom labels to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushLabel()">+</v-btn>
          </div>
          <common-form-dynamic-array path="labels" :arrayFields="labels" />
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
          <common-form-dynamic-array path="sysctls" :arrayFields="sysctls" />
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="devices">
        <v-expansion-panel-text>
          <div class="d-flex justify-space-between">
            <v-card-text>
              Add custom devices to your container.
            </v-card-text>
            <v-btn color="primary" class="float-right my-3" @click="pushDevices()">+</v-btn>
          </div>
          <common-form-dynamic-array path="devices" :arrayFields="devices" />
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

import type { CreateContainerForm } from '~/types/containers/create';
import { type Field } from '~/types/forms'
const panelsOpen = ref([])
// const { xs } = useDisplay()

const form = useFormValues<CreateContainerForm>()

const commands: ComputedRef<Field[][]> = computed(() => { return form.value.command?.map((command, index) => ([{ label: "command", value: `command[${index}]`, placeholder: "/bin/sh", cols: "12", type: "VTextField" }])) || [] })
const pushCommandField = () => {
  form.value.command ? form.value.command.push('') : form.value.command = ['']
}

const labels: ComputedRef<Field[][]> = computed(() => {
  return form.value.labels?.map((label, index) => ([
    { label: "name", cols: '6', value: `labels[${index}].name`, placeholder: "TZ", type: "VTextField" },
    { label: "value", cols: '6', value: `labels[${index}].value`, placeholder: "America/Los_Angeles", type: "VTextField" },
  ])) || []
})
const pushLabel = () => {
  form.value.labels ? form.value.labels.unshift({ name: '', value: '' }) : form.value.labels = []
}

const sysctls: ComputedRef<Field[][]> = computed(() => {
  return form.value.sysctls?.map((sysctl, index) => ([
    { label: "name", value: `sysctls[${index}].name`, placeholder: "net.ipv6.conf.all.disable_ipv6", cols: "12", type: "VTextField" },
    { label: "value", value: `sysctls[${index}].value`, placeholder: "1", cols: "12", type: "VTextField" },
  ])) || []
})
const pushSysctls = () => {
  form.value.sysctls ? form.value.sysctls.unshift({ name: '', value: '' }) : form.value.sysctls = []
}

const devices: ComputedRef<Field[][]> = computed(() => {
  return form.value.devices?.map((device, index) => ([
    { label: "host", value: `devices[${index}].name`, placeholder: "name", cols: "12", type: "VTextField" },
    { label: "container", value: `devices[${index}].path`, placeholder: "path", cols: "8", type: "VTextField" },
    { label: "permissions", value: `devices[${index}].permissions`, placeholder: "rwm", items: ['r', 'w', 'm', 'mw', 'rm', 'rwm', 'rw'], cols: "4", type: "VSelect" },
  ])) || []
})
const pushDevices = () => {
  form.value.devices ? form.value.devices.push({ host: '', container: '', permissions: 'rwm' }) : form.value.devices = []
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

<style></style>~/shared/containers/create~/shared/forms