<template>
  <v-btn color="primary">
    <v-icon icon="mdi-plus" />
    <v-menu v-model="menuOpen" activator="parent" :close-on-content-click="false">
      <v-card>
        <v-list width="40vw">
          <v-list-item class="align-center">
            <v-row align="center">
              <v-col>
                <common-form-dynamic-string @keyup.enter="templateValid = false; loading = true; validate()" block dense
                  :field="urlField" />
              </v-col>
              <!-- <v-text-field dense label="template url" hide-details="auto"
                placeholder="https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json" /> -->
              <v-col cols="3">
                <v-btn :loading="loading" @click="templateValid = false; loading = true; validate()" class="mt-1"
                  variant="plain" :rounded="0" append-icon="mdi-magnify" text="check" />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-auto-animate>
                <span v-for="error, , i in errors" :key="i" v-html="error" class="text-error" />
              </v-col>
            </v-row>
          </v-list-item>
          <v-expand-transition group>
            <div v-show="templateValid">
              <v-list-item>
                <common-form-dynamic-string block dense :field="nameField"
                  hint="name of folder created in templates directory" />
                <common-form-dynamic-string block dense :field="titleField" hint="used for tab name on this page." />
                <v-btn v-if="templateValid" block :loading="loading" class="mt-1" variant="plain" :rounded="0"
                  append-icon="mdi-plus" text="add" color="primary" @click="onSubmit" />
              </v-list-item>
            </div>
          </v-expand-transition>
        </v-list>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import { YAMLException, load } from 'js-yaml'
import { addTemplateSchema } from '~/types/templates/yacht'
import type { Field } from '~/types/forms'
const templateValid = ref(false)
const loading = ref(false)
const menuOpen = ref(false)
const templatesStore = useTemplatesStore()

const emit = defineEmits(["added"])

const { values, validate: finalVal, setFieldValue, handleSubmit, setFieldError, setErrors, errors } = useForm({ validationSchema: toTypedSchema(addTemplateSchema) })

const urlField = {
  label: "url",
  value: "url",
  placeholder: "https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json",
  type: "VTextField"
} as Field
const nameField = {
  label: "name",
  value: "name",
  placeholder: "default",
  type: "VTextField",
  validateOnMount: false
} as Field

const titleField = {
  label: "title",
  value: "title",
  placeholder: "Yacht Template",
  type: "VTextField",
  validateOnMount: false
} as Field


const isGithubUrl = (url: string) => {
  return url.includes('github.com') ? false : true
}

const templateExists = (name: string) => {
  return templatesStore.templates.find((t) => t.name === name) ? false : true
}

const validate = async () => {
  if (!values.url) {
    templateValid.value = false
    return
  }
  const { data, error } = await useFetch<string>(values.url)
  if (!data.value) {
    setFieldError('url', `${error.value?.name}: ${error.value?.statusMessage || error.value?.message}`)
    loading.value = false
    templateValid.value = false
    return
  }
  try {
    const templateJSON = load(data.value) || JSON.parse(data.value)
    templateValid.value = true
    if (templateJSON['name']) {
      setFieldValue('name', templateJSON['name'])
    }
    if (templateJSON['title']) {
      setFieldValue('title', templateJSON['title'])
    }
    loading.value = false
    return
  } catch (e) {
    // const notify = useNotifyStore()
    templateValid.value = false
    loading.value = false
    if (e instanceof YAMLException) {
      if (e.message.startsWith("Unexpected token '<'")) {
        setFieldError('url', 'Template url is not valid json and appears to be html or xml <br/>Did you remember to use the raw url?')
      } else {
        setFieldError('url', `${e.name}: <br/>${e.reason}`)
        // notify.setError(`${e.name}: Template is not valid json - ${e.message}`)
      }
      return
    }
    console.error(e)
    // notify.setError(`${e.name}: ${e.message}`)
  }
}

const onSubmit = handleSubmit((values) => {
  loading.value = true
  templatesStore.addTemplate(values.url, values.name, values.title).then(() => {
    emit('added')
    loading.value = false
    menuOpen.value = false
  })
})

</script>

<style></style>~/shared/templates/yacht~/shared/forms