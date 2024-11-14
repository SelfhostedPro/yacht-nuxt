<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Info</h3>
      <Button 
        :variant="preview ? 'destructive' : 'default'"
        @click="preview = !preview"
      >
        {{ preview ? 'Edit' : 'Preview' }}
      </Button>
    </div>

    <div v-show="!preview" class="space-y-4">
      <div class="flex items-center gap-4">
        <Avatar class="h-[60px] w-[60px]">
          <AvatarImage :src="form.info?.icon ?? fields.icon.placeholder" />
          <AvatarFallback>Icon</AvatarFallback>
        </Avatar>
        <div class="flex-1">
          <common-form-dynamic-string :field="fields.icon" />
        </div>
      </div>

      <common-form-dynamic-string :field="fields.title" />

      <div class="space-y-2">
        <common-form-dynamic-string :field="fields.notes" />
        <Alert variant="warning">
          <p class="font-bold">
            DO NOT STORE SENSITIVE INFO HERE OR R/SELFHOSTED WILL JUDGE YOU 😤
          </p>
        </Alert>
      </div>
    </div>

    <Card v-show="preview">
      <CardHeader>
        <CardTitle class="flex items-center gap-4 text-3xl">
          <Avatar class="h-[60px] w-[60px]">
            <AvatarImage :src="form.info?.icon ?? fields.icon.placeholder" />
            <AvatarFallback>Icon</AvatarFallback>
          </Avatar>
          {{ form.info?.title ?? fields.title.placeholder }}
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          {{ $mdRenderer.render(form.info?.notes ?? fields.notes.placeholder ?? '') }}
        </div>
        <Alert variant="warning">
          <p class="font-bold">
            DO NOT STORE SENSITIVE INFO HERE OR R/SELFHOSTED WILL JUDGE YOU 😤
          </p>
        </Alert>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from '#core/types/forms'
const { $mdRenderer } = useNuxtApp()

const preview = ref(false)
const form = useFormValues()

const fields = {
  icon: {
    name: "icon",
    label: "Icon",
    value: "info.icon",
    placeholder:
      "https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png",
    type: "input",
  },
  title: {
    name: "icon",
    label: "Title",
    value: "info.title",
    placeholder: "Yacht",
    type: "input",
  },
  notes: {
    name: "icon",
    label: "Notes",
    value: "info.notes",
    placeholder:
      "## Notes\n Some notes about this section: \n\n - *Markdown is supported* \n\n - [links](https://yacht.sh) are super easy to add \n\n - The container will need to be restarted to edit this (limitation of docker)",
    type: "input",
  },
} satisfies Record<string, Field>
</script>
