<template>
  <div>
    <div v-if="template.templates.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(container, i) in paginatedItems" :key="i">
          <Card class="overflow-auto min-h-[200px] max-h-[200px]">
            <CardHeader class="flex items-center">
              <img :src="container.logo" alt="Logo" class="w-10 h-10 mr-2" />
              <CardTitle class="flex-grow">
                {{ container.title || container.name }}
              </CardTitle>
              <div class="flex space-x-2">
                <Button variant="ghost" icon @click="$emit('createApp', container)">
                  <Plus class="w-4 h-4" />
                </Button>
                <Button variant="ghost" icon @click="$emit('openInfo', container)">
                  <Info class="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {{ container.image }}
              </CardDescription>
              <p>
                {{ container.description || `${container.title || container.name} doesn't provide a description.` }}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="flex items-center justify-center py-4">
        <Button :disabled="currentPage === 1" @click="prevPage">
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="mx-2 text-sm">
          Page {{ currentPage }} of {{ pageCount }}
        </span>
        <Button :disabled="currentPage >= pageCount" @click="nextPage">
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>
    <div v-else>
      <Card class="p-6 text-center">
        <CardTitle>No Templates found</CardTitle>
        <CardContent>
          <Icon name="docker" size="100" />
          <p class="text-lg">
            Add a new template to see it here. <br />
            e.g., [default_template.json](https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json)
          </p>
          <i>If there should be Templates on this server, check the logs for errors.</i>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Info, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import type { YachtTemplate } from '#core/types/templates/yacht';

interface Emits {
  (e: 'createApp' | 'openInfo', app: YachtTemplate['templates'][0]): void;
}
defineEmits<Emits>();

interface Props {
  template: YachtTemplate;
  search: string;
}
const { template } = defineProps<Props>();

const currentPage = ref(1);
const itemsPerPage = 12;

const pageCount = computed(() => Math.ceil(template.templates.length / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return template.templates.slice(start, start + itemsPerPage);
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++;
  }
}
</script>

<style>
/* Add any additional styles here if needed */
</style>
