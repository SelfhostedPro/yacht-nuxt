<template>
  <Card v-bind="$attrs">
    <div class="flex items-center mt-2 pb-1 justify-center">
      <CardTitle class="absolute left-1/2 transform -translate-x-1/2">
        {{ template.title }}
        <Button variant="ghost" size="sm" @click="expandedInfo = !expandedInfo">
          <component :is="expandedInfo ? ChevronUp : ChevronDown" class="w-4 h-4" />
        </Button>
      </CardTitle>
      <div class="ml-auto mr-5 flex">
        <p class="text-xs mr-3">created by: </p>
        <templates-list-authors :authors="template.authors" />
      </div>
    </div>
    <transition name="expand">
      <CardSubtitle v-if="expandedInfo" class="bg-surface">
        name: {{ template.name }}
        <br>
        type: {{ template.type }}
        <br>
        created: {{ formatDate(template.created) }}
        <br>
        updated: {{ formatDate(template.updated) }}
        <br>
        apps: {{ template.templates.length }}
      </CardSubtitle>
    </transition>
    <CardContent v-if="template.description" class="mx-auto w-1/2 whitespace-pre">
      {{ template.description }}
    </CardContent>
    <CardFooter class="flex justify-center">
      <Button
        v-for="link in template['links']"
        :key="link.text"
        :variant="'link'"
        :prepend-icon="link.icon || 'link'"
        :href="link.url || undefined"
        target="_blank"
      >
        {{ link.text || 'link' }}
      </Button>
      <Menu v-model="deleteMenu" :close-on-content-click="false" location="top" transition="slide-y-transition">
        <template #activator="{ props }">
          <Button v-bind="props" variant="destructive" prepend-icon="trash">delete</Button>
        </template>
        <Card :title="`delete template ${template.name}?`" max-width="30vw">
          <CardContent>
            This action cannot be undone. <br>
            Apps deployed with this template will continue to run on your system.<br>
          </CardContent>
          <CardFooter>
            <!-- <Button @click="deleteTemplate(); deleteMenu = false" variant="destructive">confirm</Button> -->
            <Button @click="deleteMenu = false">cancel</Button>
          </CardFooter>
        </Card>
      </Menu>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { parseISO } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-vue-next';
import type { YachtTemplate } from '#core/types/templates/yacht';

const expandedInfo = ref(false);
const deleteMenu = ref(false);

const formatDate = (date: string | undefined) => {
  if (date) return parseISO(date).toLocaleString();
  else return 'unknown';
};

interface Props {
  template: YachtTemplate;
}

defineProps<Props>();
</script>

<style>
/* Add any additional styles if necessary */
</style>
