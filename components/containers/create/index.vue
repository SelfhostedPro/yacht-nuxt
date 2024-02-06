<template>
  <v-dialog v-model="dialog" persistent scrollable :fullscreen="maximize" :width="maximize ? undefined : '80vw'"
    :height="maximize ? undefined : '80vh'">
    <template #default>
      <v-card color="foreground" width="80vw" height="100%">
        <common-title-bar class="form-bar" :loading="loading" color="primary" :closable="true"
          :title="`create ${values.name || 'new container'}`" @maximize="maximize = !maximize" @close="$emit('close'); dialog = false" />
        <form class="overflow-y-hidden fill-height">
          <containers-create-form />
        </form>
        <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
          <v-btn color="warning" @click="resetForm()">reset</v-btn>
          <v-spacer />
          <v-btn v-if="step !== 0" @click="step--">
            prev
          </v-btn>
          <v-btn v-if="step !== 6" color="primary" @click="step++">
            next
          </v-btn>
          <v-btn v-else color="primary">
            submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { yachtV2TemplatePortSchema, type YachtV2TemplatePort, type YachtTemplate, yachtV1TemplatePortSchema, type YachtV1TemplatePort } from '~/types/templates/yacht';
import { createContainerFormSchema, type CreateContainerForm } from "~/types/containers/create"

const dialog = defineModel<boolean>('open')

interface Props {
  template?: YachtTemplate['templates'][0],
}

const { template } = defineProps<Props>()
const loading = ref(false)
const step = useState('containerFormStep', () => 0)
const containerStore = useContainersStore()
const { servers } = storeToRefs(containerStore)

const { values, validate, handleSubmit, resetForm, setValues } = useForm({
  initialValues: {
    image: '',
    server: Object.keys(servers.value)[0] || '',
  },
  validationSchema: toTypedSchema(createContainerFormSchema),
  keepValuesOnUnmount: true
})
const maximize = ref(false)


defineEmits(['close', 'maximize'])

onMounted(async () => {
  console.log('mounting card')
  if (template) {
    await populateFromTemplate()
  } else {
    // Load and validate values on mount
    const savedContainerForm = localStorage.getItem('yacht_savedContainerForm')
    if (savedContainerForm) {
      const savedValues = JSON.parse(savedContainerForm) as CreateContainerForm
      const isValid = createContainerFormSchema.safeParse(savedValues)
      if (isValid.success) {
        setValues(savedValues)
      } else {
        console.log(isValid.error)
        localStorage.removeItem('yacht_savedContainerForm')
      }
    }
  }
})

// Populate Form from Templates
const populateFromTemplate = async () => {
  const importedTemplate: Partial<CreateContainerForm> = {
    name: template?.name || '',
    image: template?.image || '',
    server: Object.keys(servers.value)[0] || '',
    restart: template?.restart_policy || 'unless-stopped',
    info: {
      icon: template?.logo || 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png',
      title: template?.title || template?.name || '',
      notes: template?.description || '',
    },
    network_mode: template?.ports !== undefined ? 'bridge' : undefined,
    ports: await formatPorts(template?.ports),
    mounts: template?.volumes?.map((volume) => {
      return {
        source: volume.container,
        destination: volume.bind,
        read_only: volume.readonly || false,
      }
    }) || [],
    labels: template?.labels || [],
    env: template?.env?.map((env) => {
      return {
        name: env.name,
        value: env.default,
        label: env.label,
        description: env.description
      }
    }) || [],
    command: template?.command ? [template.command] : [],
    sysctls: template?.sysctls?.map((sysctl) => ({ name: Object.keys(sysctl)[0], value: Object.values(sysctl)[0] })) || [],
    devices: template?.devices || [],
    capabilities: {
      add: template?.cap_add || [],
      drop: template?.cap_drop || [],
    },
    limits: template?.limits || {
      cpus: undefined,
      mem_limit: undefined,
    }
  }
  setValues(importedTemplate)
}

const formatPorts = async (ports: YachtTemplate['templates'][0]['ports']): Promise<CreateContainerForm['ports']> => {
  let type: 'yachtv2' | 'yachtv1' | undefined
  const portlist: CreateContainerForm['ports'] = []
  !Array.isArray(ports) && yachtV2TemplatePortSchema.safeParse(ports)
    ? type = 'yachtv2'
    : yachtV1TemplatePortSchema.safeParse(ports)
      ? type = 'yachtv1'
      : type = undefined
  console.log(type)
  switch (type) {
    case 'yachtv2': {
      Object.entries(ports as YachtV2TemplatePort).map(([name, port]) => {
        portlist.push({
          host: port.host,
          container: port.container,
          protocol: port.protocol,
          label: name,
          unchangable: port.unchangable
        })
      })
      break;
    }
    case 'yachtv1': {
      (ports as YachtV1TemplatePort).map((port) => {
        if (typeof port === 'string') {
          console.log('string', port)
          port.includes(':') && port.includes('/')
            ? portlist.push({ host: port.split(':')[0], container: port.split(':')[1], protocol: port.split('/')[1] as "tcp" | "udp" || undefined })
            : typeof port === 'string' && port.includes(':')
              ? portlist.push({ host: port.split(':')[0], container: port.split(':')[1] })
              : portlist.push({ container: port })
        } else {
          for (const _port in port) {
            const portString = port[_port]
            portString.includes(':') && portString.includes('/')
              ? portlist.push({ label: _port, host: portString.split(':')[0], container: portString.split(':')[1].split('/')[0], protocol: portString.split('/')[1] as "tcp" | "udp" || undefined })
              : portString.includes(':')
                ? portlist.push({ label: _port, host: portString.split(':')[0], container: portString.split(':')[1] })
                : portlist.push({ label: _port, container: portString })
          }
        }
      })
      break;
    }
  }
  return portlist
}

onBeforeUnmount(() => {
  // Save values before unmount
  localStorage.setItem('yacht_savedContainerForm', JSON.stringify(values))
})
</script>

<style></style>