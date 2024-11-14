<template>
  <Card>
    <Tabs v-model="tab">
      <TabsList>
        <TabsTrigger :value="0">ports</TabsTrigger>
        <TabsTrigger :value="1">networks</TabsTrigger>
        <TabsTrigger :value="2">advanced</TabsTrigger>
      </TabsList>

      <TabsContent :value="0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader class="text-left">container port</TableHeader>
              <TableHeader class="text-center">host ip</TableHeader>
              <TableHeader class="text-right">host port</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody v-if="container.ports">
            <TableRow v-for="port of container.ports" :key="port.containerPort">
              <TableCell class="text-left">{{ port.containerPort }}</TableCell>
              <TableCell class="text-center">{{ port.hostIP || '-' }}</TableCell>
              <TableCell class="text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <Button v-if="port.hostPort" prepend-icon="mdi-link-variant" color="primary">
                      {{ container.labels?.[`sh.yacht.${port.hostPort}`] || port.hostPort }}
                    </Button>
                    <span v-else>-</span>
                  </TooltipTrigger>
                  <TooltipContent>{{ port.hostPort }}</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
          <CardContent v-else>
            {{ container.name }} {{ container.status !== 'running' ? 'is not running' : 'has no ports forwarded' }}
          </CardContent>
        </Table>
      </TabsContent>

      <TabsContent :value="1">
        <div>
          <div v-for="(network, name) in container.config.network.networks" :key="name" class="mb-4">
            <h4 class="font-semibold">{{ name }}</h4>
            <p>ip address: {{ network.IPAddress + '/' + network.IPPrefixLen }}</p>
            <p>gateway: {{ network.Gateway + '/' + network.IPPrefixLen }}</p>
            <p>id: {{ network.NetworkID }}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent :value="2">
        <div>
          <div class="mb-4">
            <h4 class="font-semibold">mode</h4>
            <p>{{ container.config.network.mode }}</p>
          </div>
          <div>
            <h4 class="font-semibold">hostname</h4>
            <p>{{ container.config.general?.hostname }}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Container } from '#docker/types/containers/yachtContainers';

interface Props {
  container: Container;
}
defineProps<Props>();
const tab = ref(0);
</script>
