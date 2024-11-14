<template>
  <Card id="networks-card" class="overflow-auto bg-foreground">
    <CardHeader class="flex justify-between items-center">
      <CardTitle>{{ resource.Name.toLowerCase() }}</CardTitle>
      <Button variant="ghost" icon @click="reveal = !reveal">
        <component :is="reveal ? ChevronUp : ChevronDown" class="w-4 h-4" />
      </Button>
    </CardHeader>
    <CardContent v-if="reveal" class="transition-all duration-300">
      <pre>{{ resource }}</pre>
    </CardContent>
    <CardFooter>
      <div class="flex flex-col space-y-2">
        <div class="flex justify-between">
          <span>id:</span>
          <span>{{ resource.Id.slice(0, 12) }}</span>
        </div>
        <div class="flex justify-between">
          <span>created:</span>
          <span>{{ formatDates(resource.Created) }}</span>
        </div>
        <div class="flex justify-between">
          <span>driver:</span>
          <span>{{ resource.Driver }}</span>
        </div>
        <div class="flex justify-between">
          <span>ipv6:</span>
          <span>{{ resource.EnableIPv6 }}</span>
        </div>
        <div v-if="resource.IPAM?.Config && resource.IPAM.Config[0] && resource.IPAM.Config[0]['Subnet']"
          class="flex justify-between">
          <span>subnet:</span>
          <span>{{ resource.IPAM.Config[0]['Subnet'] }}</span>
        </div>
        <div v-if="resource.IPAM?.Config && resource.IPAM.Config[0] && resource.IPAM.Config[0]['Gateway']"
          class="flex justify-between">
          <span>gateway:</span>
          <span>{{ resource.IPAM.Config[0]['Gateway'] }}</span>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { parseISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import type { NetworkInspectInfo } from 'dockerode';

const reveal = ref(false);

const formatDates = (date: string) => {
  return parseISO(date).toLocaleString();
};

interface Props {
  server: string;
  resource: NetworkInspectInfo;
}

defineProps<Props>();
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
