<template>
  <Card class="pb-2">
    <CardHeader>
      <Button variant="ghost" class="p-2" @click="reveal = !reveal">
        <component :is="reveal ? ChevronUp : ChevronDown" class="w-4 h-4" />
      </Button>
      <CardTitle>{{ resource.Name }}</CardTitle>
    </CardHeader>
    <CardContent v-show="reveal" class="overflow-auto">
      <pre>{{ resource }}</pre>
    </CardContent>
    <CardFooter>
      <div v-if="resource.CreatedAt">created: {{ formatDates(resource.CreatedAt) }}</div>
      <div>driver: {{ resource.Driver }}</div>
      <div>mount: {{ resource.Mountpoint }}</div>
      <div v-if="resource.Options">options: {{ resource.Options }}</div>
      <div v-if="resource.Scope">scope: {{ resource.Scope }}</div>
      <div v-if="resource.Status">status: {{ resource.Status }}</div>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { parseISO } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-vue-next';
import type { FixedVolumeInspectInfo } from '#docker/types/containers/fixedDockerode';

const reveal = ref(false);

const formatDates = (date: string) => {
  return parseISO(date).toLocaleString();
};

interface Props {
  server: string;
  resource: FixedVolumeInspectInfo;
}
defineProps<Props>();
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
