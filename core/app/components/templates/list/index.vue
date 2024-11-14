<template>
  <div class="container mx-auto p-0">
    <Tabs v-model="tab" class="bg-surface text-primary text-center">
      <TabsList>
        <TabsTrigger v-for="(template, i) in templates" :key="i" :value="i">
          {{ template.name }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <div class="flex justify-between p-2">
      <div class="max-w-xs">
        <Input v-model="search" clearable placeholder="Search" icon="search" @click:clear="search = ''" />
      </div>
      <div class="flex items-center space-x-2">
        <templates-list-add />
        <Button icon :loading="loading.includes('containers')" @click="refresh">
          <ChevronDown class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <TabsContent :value="tab" class="mt-5">
      <template v-if="templates && templates.length > 0">
        <TabsTrigger v-for="(template, i) in templates" :key="i" :value="i">
          <Transition name="fade">
            <div v-if="search.length < 1 && template.featured">
              <lazy-templates-list-ecarousel :template="template"
                @create-app="(app: YachtTemplate['templates'][0]) => createContainerFromTemplate(app)" />
            </div>
          </Transition>
          <templates-list-info v-if="search.length < 1" class="text-center mx-auto" :template="template" />
          <templates-list-card class="mt-4" :template="template" :search="search"
            @create-app="(app: YachtTemplate['templates'][0]) => createContainerFromTemplate(app)" />
        </TabsTrigger>
      </template>
      <div v-else>
        <Card class="p-3">
          <CardTitle class="text-center"> No templates found </CardTitle>
          <CardDescription class="text-center">
            <Icon name="docker" class="w-24 h-24 mx-auto" />
            <div class="text-lg">Add a new template to see it here.</div>
            <i>If there should be templates on this server, check the logs for errors.</i>
          </CardDescription>
        </Card>
      </div>
    </TabsContent>


    <Dialog v-model="openInfo" :fullscreen="maximize">
      <DialogContent>
        <common-title-bar :title="`${selectedApp?.title || selectedApp?.name} info`" color="primary" :closable="true"
          @maximize="maximize = !maximize" @close="closeDialog" />
        <DialogDescription>
          <!-- <template-info :template="selectedApp" /> -->
        </DialogDescription>
      </DialogContent>
    </Dialog>
  </div>
  <containers-create v-model:open="createDialog" :template="selectedApp" @close="createDialog = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useTemplatesStore } from '#core/app/stores/templates';
import type { YachtTemplate } from '#core/types/templates/yacht';

const templatesStore = useTemplatesStore();
const { loading, templates } = storeToRefs(templatesStore);
const tab = ref(0);
const search = ref('');

const createDialog = ref(false);
const selectedApp = ref<YachtTemplate['templates'][0] | undefined>();
const openInfo = ref(false);
const maximize = ref(false);

const createContainerFromTemplate = (app: YachtTemplate['templates'][0]) => {
  selectedApp.value = app;
  createDialog.value = true;
};

const { refresh } = useAsyncData('templateList', () => templatesStore.fetchTemplates(), {});

const closeDialog = () => {
  openInfo.value = false;
  selectedApp.value = undefined;
};
</script>
