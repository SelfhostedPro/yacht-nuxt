<template>
  <Card class="px-2">
    <template #prepend>
      <containers-list-card-stats
        v-if="container.status === 'running' && stats"
        :stats="stats"
      >
        <template #default>
          <Avatar>
            <AvatarImage 
              :src="container.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" 
              alt="Container Icon"
            />
          </Avatar>
        </template>
      </containers-list-card-stats>
      <Avatar v-else>
        <AvatarImage 
          :src="container.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" 
          alt="Container Icon"
        />
      </Avatar>
    </template>
    <CardHeader>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar :class="['ml-1', container.status === 'running' ? 'bg-primary' : 'bg-red']" size="sm">
              <!-- Avatar content or fallback can be added if needed -->
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{{ container.state }}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CardTitle>{{ container.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{{ "image: " + container.image }}</CardDescription>
      <CardDescription>{{ "id: " + container.shortId }}</CardDescription>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { 
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import type { Container, ContainerStat } from "#docker/types/containers/yachtContainers";

interface Props {
  container: Container;
  stats?: ContainerStat;
}
defineProps<Props>();
</script>
