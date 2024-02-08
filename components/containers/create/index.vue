<template>
  <v-dialog v-model="dialog" :close-on-content-click="false" persistent no-click-animation scrollable :fullscreen="maximize" :width="maximize ? undefined : '80vw'"
    :height="maximize ? undefined : '80vh'">
    <template #default>
      <v-card color="foreground" width="80vw" height="100%" :loading="loading.includes('create')">
        <common-title-bar class="form-bar" :loading="loading" color="primary" :closable="true"
          :title="`create ${values.name || 'new container'}`" @maximize="maximize = !maximize"
          @close="$emit('close'); dialog = false" />
        <form class="overflow-y-hidden fill-height">
          <containers-create-form @validate="validate()" />
        </form>
        <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
          <v-btn color="warning" @click="resetForm()">reset</v-btn>
          <v-spacer />
          <v-btn v-if="step !== 0" @click="step--; validate()">
            prev
          </v-btn>
          <v-btn v-if="step !== 6" color="primary" @click="step++; validate()">
            next
          </v-btn>
          <span v-else>
            <v-btn :disabled="!meta.valid" color="primary" @click="onSubmit">
              submit
            </v-btn>
            <v-tooltip class="submitTooltip" v-if="!meta.valid" location="top left" activator="parent">
              <v-card-text v-for="error, key, i in errors" :key="i">{{ `${key}: ${error}` }}</v-card-text>
            </v-tooltip>
          </span>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { yachtV2TemplatePortSchema, type YachtV2TemplatePort, type YachtTemplate, yachtV1TemplatePortSchema, type YachtV1TemplatePort, type yachtV1TemplatePorts } from '~/types/templates/yacht';
import { createContainerFormSchema, type CreateContainerForm } from "~/types/containers/create"
import type { PartialDeep } from 'type-fest';

const dialog = defineModel<boolean>('open')

interface Props {
  template?: YachtTemplate['templates'][0],
}

const { template } = defineProps<Props>()
const step = useState('containerFormStep', () => 0)
const containerStore = useContainersStore()
await useAsyncData('servers', () => containerStore.fetchContainers().then(() => true))
const { loading, servers: _servers } = storeToRefs(containerStore)
const servers: ComputedRef<string[]> = computed(() => Object.keys(_servers.value))


const { values, validate, handleSubmit, resetForm, setValues, errors, meta } = useForm({
  initialValues: {
    image: '',
    server: servers.value[0] || '',
  },
  validationSchema: toTypedSchema(createContainerFormSchema),
  keepValuesOnUnmount: true
})
const maximize = ref(false)

defineEmits(['close', 'maximize'])

onMounted(async () => {
  if (template) {
    await populateFromTemplate().then(() => validate())
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
  const importedTemplate: PartialDeep<CreateContainerForm> = {
    name: template?.name || '',
    image: template?.image || '',
    server: servers.value[0] || '',
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
        label: volume.label
      }
    }) || [],
    labels: template?.labels || [],
    env: template?.env?.map((env) => {
      return {
        name: env.name,
        value: env.default || '',
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
  switch (type) {
    case 'yachtv2': {
      Object.entries(ports as YachtV2TemplatePort).map(([name, port]) => {
        portlist.push({
          host: port.host ? parseInt(port.host) : undefined,
          container: port.container ? parseInt(port.container) : undefined,
          protocol: port.protocol,
          label: name,
          unchangable: port.unchangable
        })
      })
      break;
    }
    case 'yachtv1': {
      (ports as yachtV1TemplatePorts).map((port): void => {
        if (typeof port === 'string') {
          port.includes(':') && port.includes('/')
            ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1].split('/')[0]), protocol: port.split('/')[1] as "tcp" | "udp" || undefined })
            : typeof port === 'string' && port.includes(':')
              ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1]) })
              : portlist.push({ container: parseInt(port) })
        } else {
          for (const _port in port) {
            const portString = port[_port]
            portString.includes(':') && portString.includes('/')
              ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1].split('/')[0]), protocol: portString.split('/')[1] as "tcp" | "udp" || undefined })
              : portString.includes(':')
                ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1]) })
                : portlist.push({ label: _port, container: parseInt(portString) })
          }
        }
      })
      break;
    }
  }
  return portlist
}

const onSubmit = handleSubmit(values => {
  containerStore.fetchCreateContainer(values)
    .then(() => {
      resetForm()
      dialog.value = false
    })
    .catch((e) => {
      console.log(e)
    })
})

onBeforeUnmount(() => {
  // Save values before unmount
  localStorage.setItem('yacht_savedContainerForm', JSON.stringify(values))
})
</script>

<style>
.submitTooltip>.v-overlay__content {
  background-color: rgba(var(--v-theme-error), 0.8) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}
</style>