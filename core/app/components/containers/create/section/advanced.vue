<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Advanced</h3>
    </div>

    <Accordion type="multiple" v-model:value="panelsOpen" class="w-full">
      <!-- Commands -->
      <AccordionItem value="command">
        <AccordionTrigger>Command</AccordionTrigger>
        <AccordionContent>
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground">
              Add custom commands to your container.
            </p>
            <Button variant="outline" size="sm" @click="pushCommandField()">
              <Icon icon="lucide:plus" class="h-4 w-4" />
            </Button>
          </div>
          <common-form-dynamic-array path="command" :array-fields="commands" />
        </AccordionContent>
      </AccordionItem>

      <!-- Labels -->
      <AccordionItem value="labels">
        <AccordionTrigger>Labels</AccordionTrigger>
        <AccordionContent>
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground">
              Add custom labels to your container.
            </p>
            <Button variant="outline" size="sm" @click="pushLabel()">
              <Icon icon="lucide:plus" class="h-4 w-4" />
            </Button>
          </div>
          <common-form-dynamic-array path="labels" :array-fields="labels" />
        </AccordionContent>
      </AccordionItem>

      <!-- Sysctls -->
      <AccordionItem value="sysctls">
        <AccordionTrigger>Sysctls</AccordionTrigger>
        <AccordionContent>
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground">
              Add custom sysctls to your container.
            </p>
            <Button variant="outline" size="sm" @click="pushSysctls()">
              <Icon icon="lucide:plus" class="h-4 w-4" />
            </Button>
          </div>
          <common-form-dynamic-array path="sysctls" :array-fields="sysctls" />
        </AccordionContent>
      </AccordionItem>

      <!-- Devices -->
      <AccordionItem value="devices">
        <AccordionTrigger>Devices</AccordionTrigger>
        <AccordionContent>
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground">
              Add custom devices to your container.
            </p>
            <Button variant="outline" size="sm" @click="pushDevices()">
              <Icon icon="lucide:plus" class="h-4 w-4" />
            </Button>
          </div>
          <common-form-dynamic-array path="devices" :array-fields="devices" />
        </AccordionContent>
      </AccordionItem>

      <!-- Capabilities -->
      <AccordionItem value="capabilities">
        <AccordionTrigger>Capabilities</AccordionTrigger>
        <AccordionContent>
          <div class="space-y-4">
            <p class="text-muted-foreground">
              Add or drop custom capabilities for your container.
            </p>
            <div class="space-y-2">
              <h4 class="font-medium">Add</h4>
              <common-form-dynamic-string :field="capAddField" />
            </div>
            <div class="space-y-2">
              <h4 class="font-medium">Drop</h4>
              <common-form-dynamic-string :field="capDropField" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <!-- Limits -->
      <AccordionItem value="limits">
        <AccordionTrigger>Limits</AccordionTrigger>
        <AccordionContent>
          <div class="space-y-4">
            <p class="text-muted-foreground">
              Add custom commands to your container.
            </p>
            <div class="space-y-2">
              <h4 class="font-medium">CPU</h4>
              <common-form-dynamic-string :field="cpuLimitsField" />
            </div>
            <div class="space-y-2">
              <h4 class="font-medium">Memory</h4>
              <common-form-dynamic-string :field="memoryLimitsField" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script lang="ts" setup>
import type { CreateContainerForm } from '#docker/types/containers/create';
import type { Field } from '#core/types/forms'

const panelsOpen = ref([])
const form = useFormValues<CreateContainerForm>()

const commands: ComputedRef<Field[][]> = computed(() => {
  return form.value.command?.map((_, index) => ([
    { 
      label: "command", 
      value: `command[${index}]`, 
      name: `command[${index}]`,
      placeholder: "/bin/sh", 
      type: "input" 
    }
  ])) || []
})

const pushCommandField = () => {
  if (form.value.command) {
    form.value.command.push('')
  } else {
    form.value.command = ['']
  }
}

const labels: ComputedRef<Field[][]> = computed(() => {
  return form.value.labels?.map((_, index) => ([
    { 
      label: "name", 
      name: `labels[${index}].name`,
      value: `labels[${index}].name`, 
      placeholder: "TZ", 
      type: "input" 
    },
    { 
      label: "value", 
      name: `labels[${index}].value`,
      value: `labels[${index}].value`, 
      placeholder: "America/Los_Angeles", 
      type: "input" 
    },
  ])) || []
})

const pushLabel = () => {
  if (form.value.labels) {
    form.value.labels.unshift({ name: '', value: '' })
  } else {
    form.value.labels = [{ name: '', value: '' }]
  }
}

const sysctls: ComputedRef<Field[][]> = computed(() => {
  return form.value.sysctls?.map((_, index) => ([
    { 
      label: "name", 
      name: `sysctls[${index}].name`,
      value: `sysctls[${index}].name`, 
      placeholder: "net.ipv6.conf.all.disable_ipv6", 
      type: "input" 
    },
    { 
      label: "value",
      name: `sysctls[${index}].value`, 
      value: `sysctls[${index}].value`, 
      placeholder: "1", 
      type: "input" 
    },
  ])) || []
})

const pushSysctls = () => {
  if (form.value.sysctls) {
    form.value.sysctls.unshift({ name: '', value: '' })
  } else {
    form.value.sysctls = [{ name: '', value: '' }]
  }
}

const devices: ComputedRef<Field[][]> = computed(() => {
  return form.value.devices?.map((_, index) => ([
    { 
      label: "host", 
      name: `devices[${index}].name`,
      value: `devices[${index}].name`, 
      placeholder: "name", 
      type: "input" 
    },
    { 
      label: "container", 
      name: `devices[${index}].path`,
      value: `devices[${index}].path`, 
      placeholder: "path", 
      type: "input" 
    },
    { 
      label: "permissions", 
      name: `devices[${index}].permissions`,
      value: `devices[${index}].permissions`, 
      placeholder: "rwm", 
      items: ['r', 'w', 'm', 'mw', 'rm', 'rwm', 'rw'], 
      type: "select" 
    },
  ])) || []
})

const pushDevices = () => {
  if (form.value.devices) {
    form.value.devices.push({ host: '', container: '', permissions: 'rwm' })
  } else {
    form.value.devices = [{ host: '', container: '', permissions: 'rwm' }]
  }
}

const capAddField: Field = {
  label: "capability",
  name: "capabilities.add",
  value: "capabilities.add",
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
  type: "select"
}

const capDropField: Field = {
  label: "capability",
  name: "capabilities.drop",
  value: "capabilities.drop",
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
  type: "select"
}

const cpuLimitsField: Field = {
  label: "CPU",
  name: "limits.cpu",
  value: "limits.cpu",
  placeholder: "1",
  type: "input"
}

const memoryLimitsField: Field = {
  label: "Memory",
  name: "limits.memory",
  value: "limits.memory",
  placeholder: "1000b | 100k | 10m | 1g",
  type: "input"
}
</script>
