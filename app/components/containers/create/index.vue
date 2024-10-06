<template>
  <v-dialog v-model="dialog" @update:model-value="() => template ? populateFromTemplate(template) : null"
    :close-on-content-click="false" persistent no-click-animation scrollable :fullscreen="maximize"
    :width="maximize ? undefined : '80vw'" :height="maximize ? undefined : '80vh'">
    <template #default>
      <v-card color="foreground" width="80vw" height="100%" :loading="loading.includes('create')">
        <common-title-bar class="form-bar" :loading="loading" color="primary" :closable="true"
          :title="`create ${values.name || 'new container'}`" @maximize="maximize = !maximize"
          @close="$emit('close'); dialog = false" />
        <form class="overflow-y-hidden fill-height">
          <containers-create-form @validate="validate()" />
        </form>
        <v-card-actions style="background-color: rgb(var(--v-theme-surface)) !important;">
          <v-btn color="warning"
            @click="async () => resetForm({ values: template ? await populateFromTemplate(template) : undefined })">reset</v-btn>
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

const dialog = defineModel<boolean>('open', { default: false })
const template = defineModel<YachtTemplate['templates'][0]>('template')

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

watch(dialog, (open) => {
  if (open) {
    populateFromLocalStorage()
    if (template.value && template.value.image !== values.image) {
      populateFromTemplate(template.value).then((populatedTemplate) => {
        setValues(populatedTemplate)
      })
    }
  } else {
    localStorage.setItem('yacht_savedContainerForm', JSON.stringify(values))
  }
})

const populateFromLocalStorage = () => {
  const savedContainerForm = localStorage.getItem('yacht_savedContainerForm')
  if (savedContainerForm) {
    const savedValues = JSON.parse(savedContainerForm) as CreateContainerForm
    const isValid = createContainerFormSchema.deepPartial().safeParse(savedValues)
    setValues(savedValues)
    if (!isValid.success) console.log(isValid.error)
  }
}

// Populate Form from Templates
const populateFromTemplate = async (template: YachtTemplate['templates'][0]): Promise<PartialDeep<CreateContainerForm>> => {
  return {
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
    ports: await useFormatPorts(template?.ports),
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
}




const onSubmit = handleSubmit(values => {
  dialog.value = false
  containerStore.fetchCreateContainer(values)
    .then(() => {
      resetForm()
    })
    .catch((e) => {
      dialog.value = true
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
</style>~/shared/templates/yacht~/shared/containers/create