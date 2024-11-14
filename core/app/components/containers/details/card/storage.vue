<template>
  <Card>
    <Tabs v-model="tab" class="bg-primary text-foreground">
      <TabsList>
        <TabsTrigger value="0">Mounts</TabsTrigger>
      </TabsList>
      <TabsContent value="0">
        <div v-if="container.mounts && container.mounts[0]">
          <ul>
            <li v-for="mount in container.mounts" :key="mount.destination" class="text-no-wrap">
              <div>{{ mount.destination }}</div>
              <div>{{ `type: ${mount['type']}` }}</div>
              <div v-if="mount.name">{{ `name: ${mount.name}` }}</div>
              <div v-if="mount['driver']">{{ `driver: ${mount['driver']}` }}</div>
              <div>{{ `read-only: ${!mount['rw']}` }}</div>
              <div>{{ `source: ${mount.source}` }}</div>
            </li>
          </ul>
        </div>
        <div v-else>No mounts configured.</div>
      </TabsContent>
    </Tabs>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Container } from '#docker/types/containers/yachtContainers';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Props {
  container: Container;
}

defineProps<Props>();
const tab = ref(0);
</script>

<style scoped>
.text-no-wrap {
  white-space: nowrap;
}
</style>
