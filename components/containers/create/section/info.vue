<template>
  <div>
    <v-card-title class="d-flex">
      Meta Info
      <v-spacer />
      <v-btn :color="preview ? 'warning' : 'primary'" @click="preview = !preview">{{ preview ? 'edit' : 'preview'
      }}</v-btn>
    </v-card-title>
    <v-card-text v-show="!preview">
      <v-row no-gutters>
        <v-col :cols="xs ? '3' : '2'">
          <v-avatar size="60" :image="previews.values.info?.icon || fields['icon'].placeholder" />
        </v-col>
        <v-col>
          <containers-create-section-dynamic-string :field="fields['icon']" />
        </v-col>
      </v-row>
      <containers-create-section-dynamic-string :field="fields['title']" />
      <containers-create-section-dynamic-string :field="fields['notes']" />
    </v-card-text>
    <v-card v-show="preview">
      <v-card-text>
        <v-card-title class="text-h3">
          <v-avatar size="60" :image="previews.values.info?.icon || fields['icon'].placeholder" />
          {{ previews.values.info?.title || fields['title'].placeholder }}
        </v-card-title>
        <v-card></v-card>
        <v-card-text v-html="$mdRenderer.render(previews.values.info?.notes || fields['notes'].placeholder || '')">
        </v-card-text>
        <v-card-text class="font-weight-black">DO NOT STORE SENSITIVE INFO HERE OR R/SELFHOSTED WILL JUDGE YOU
          😤</v-card-text>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from "./dynamic-string.vue";
const { xs } = useDisplay()
const previews = useContainerFormState();
const preview = ref(false)

const fields: { [name: string]: Field } = {
  icon: {
    label: "Icon",
    value: "info.icon",
    placeholder:
      "https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png",
    type: "VTextField",
  },
  title: {
    label: "Title",
    value: "info.title",
    placeholder: "Yacht",
    type: "VTextField",
  },
  notes: {
    label: "Notes",
    value: "info.notes",
    placeholder:
      "## Notes\n Some notes about this section: \n\n - *Markdown is supported* \n\n - [links](https://yacht.sh) are super easy to add \n\n - The container will need to be restarted to edit this (limitation of docker)",
    type: "VTextarea",
  },
};
</script>

<style></style>
