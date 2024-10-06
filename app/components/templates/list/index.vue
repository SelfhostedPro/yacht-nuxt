<template>
  <v-container fluid class="p-0">
    <v-tabs v-model="tab" bg-color="surface" color="primry" align-tabs="center">
      <v-tab v-for="(template, i) in templates" :key="i" :value="i">
        {{ template.name }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row justify="space-between">
        <v-col>
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            @click:clear="search = ''"
            hide-details
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px"
            variant="solo"
          />
        </v-col>
        <v-col cols="3" class="d-flex justify-end align-center">
          <templates-list-add />
          <v-btn icon :loading="loading.includes('containers')" @click="">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item
        v-if="templates && templates.length > 0"
        v-for="(template, i) in templates"
        :key="i"
        :value="i"
      >
        <v-fade-transition>
          <div v-if="search.length < 1 && template.featured">
            <lazy-templates-list-ecarousel
              :template="template"
              @create-app="(app: YachtTemplate['templates'][0]) => createContainerFromTemplate(app)"
            />
            <!-- <lazy-templates-list-carousel :template="template"
              @create-app="(app: YachtTemplate['templates'][0]) => createContainerFromTemplate(app)" /> -->
          </div>
        </v-fade-transition>
        <templates-list-info
          color="foreground"
          variant="flat"
          rounded="0"
          class="text-center mx-auto"
          v-if="search.length < 1"
          :template="template"
        />
        <templates-list-card
          @create-app="(app: YachtTemplate['templates'][0]) => createContainerFromTemplate(app)"
          class="mt-4"
          :template="template"
          :search="search"
        />
      </v-window-item>
      <div v-else>
        <v-card class="pa-3">
          <v-card-title class="text-center"> No templates found </v-card-title>
          <v-card-text class="text-center">
            <v-icon size="100"> mdi-docker </v-icon>
            <div class="text-h6">Add a new template to see it here.</div>
            <i
              >If there should be templates on this server, check the logs for
              errors.</i
            >
          </v-card-text>
        </v-card>
      </div>
    </v-window>

    <v-dialog
      v-model="openInfo"
      :max-width="maximize ? undefined : '800'"
      :fullscreen="maximize"
      transition="dialog-bottom-transition"
    >
      <template v-slot:default>
        <v-card color="background" class="overflow-auto">
          <common-title-bar
            :title="`${selectedApp?.title || selectedApp?.name} info`"
            color="primary"
            @maximize="maximize = !maximize"
            :closable="true"
            @close="
              openInfo = false;
              selectedApp = undefined;
            "
          />
          <v-card-text>
            <!-- <template-info :template="selectedApp" /> -->
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
  <containers-create
    v-model:open="createDialog"
    :template="selectedApp"
    @close="createDialog = false"
  />
</template>
<script setup lang="ts">
import type { YachtTemplate } from "~/types/templates/yacht";

const templatesStore = useTemplatesStore();
const { loading, templates } = storeToRefs(templatesStore);
const tab = ref(0);
const search = ref("");

const createDialog = ref(false);
const selectedApp = ref<YachtTemplate["templates"][0] | undefined>();
const openInfo = ref(false);
const maximize = ref(false);

const createContainerFromTemplate = (app: YachtTemplate["templates"][0]) => {
  selectedApp.value = app;
  createDialog.value = true;
};

useAsyncData("templateList", () => templatesStore.fetchTemplates(), {});

// const refresh = async () => {
//   await until(notifications).toBe(true)
//   await useAsyncData('templateList', () => templatesStore.fetchTemplates(), {
//   })
// }
// onMounted(async () => {
//   refresh()
// })
</script>
