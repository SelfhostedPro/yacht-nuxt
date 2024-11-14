<template>
  <div>
    <DropdownMenu v-model:open="menuOpen">
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <Icon icon="lucide:plus" class="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-[40vw]">
        <Card class="border-0 shadow-none">
          <CardContent class="space-y-4">
            <!-- URL Input -->
            <div class="flex gap-2">
              <div class="flex-1">
                <common-form-dynamic-string :field="{
                  ...urlField,
                  type: 'input'
                }" @keyup.enter="validateTemplate" />
              </div>
              <Button :disabled="loading" variant="outline" @click="validateTemplate">
                <Icon icon="lucide:search" class="h-4 w-4 mr-2" />
                Check
              </Button>
            </div>

            <!-- Errors -->
            <div v-auto-animate>
              <p v-for="(error, i) in errors" :key="i" class="text-destructive text-sm" v-html="error" />
            </div>

            <!-- Expanded Form -->
            <div v-show="templateValid" class="space-y-4" v-auto-animate>
              <common-form-dynamic-string :field="{
                ...nameField,
                type: 'input'
              }" class="mb-2">
                <template #description>
                  Name of folder created in templates directory
                </template>
              </common-form-dynamic-string>

              <common-form-dynamic-string :field="{
                ...titleField,
                type: 'input'
              }" class="mb-2">
                <template #description>
                  Used for tab name on this page
                </template>
              </common-form-dynamic-string>

              <Button v-if="templateValid" :disabled="loading" class="w-full" @click="handleSubmit(submitForm)">
                <Icon icon="lucide:plus" class="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script lang="ts" setup>
import { YAMLException, load } from 'js-yaml'
import { addTemplateSchema } from '#core/types/templates/yacht'
import type { Field } from '#core/types/forms'
import { useTemplatesStore } from '#core/app/stores/templates'

const templateValid = ref(false)
const loading = ref(false)
const menuOpen = ref(false)
const templatesStore = useTemplatesStore()

const emit = defineEmits(["added"])

const form = useForm({
  validationSchema: toTypedSchema(addTemplateSchema),
})

const { handleSubmit, setFieldValue, setFieldError, errors } = form

const urlField: Field = {
  label: "URL",
  name: "url",
  value: "url",
  placeholder: "https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json",
  type: "input"
}

const nameField: Field = {
  label: "Name",
  name: "name",
  value: "name",
  placeholder: "default",
  type: "input",
  validateOnMount: false
}

const titleField: Field = {
  label: "Title",
  name: "title",
  value: "title",
  placeholder: "Yacht Template",
  type: "input",
  validateOnMount: false
}

const validateTemplate = async () => {
  const formValues = form.values
  if (!formValues.url) {
    templateValid.value = false
    return
  }
  loading.value = true

  const { data, error } = await useFetch<string>(formValues.url)
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
  } catch (e) {
    templateValid.value = false
    if (e instanceof YAMLException) {
      if (e.message.startsWith("Unexpected token '<'")) {
        setFieldError('url', 'Template url is not valid json and appears to be html or xml <br/>Did you remember to use the raw url?')
      } else {
        setFieldError('url', `${e.name}: <br/>${e.reason}`)
      }
    }
    console.error(e)
  } finally {
    loading.value = false
  }
}

const submitForm = async (values: any) => {
  loading.value = true
  try {
    await templatesStore.addTemplate(values.url, values.name, values.title)
    emit('added')
    menuOpen.value = false
  } finally {
    loading.value = false
  }
}
</script>
