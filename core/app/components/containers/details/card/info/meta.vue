<template>
  <Card>
    <CardHeader v-if="info.title">
      <CardTitle tag="span">{{ info.title }}</CardTitle>
      <Popover v-for="link, i in links" :key="i">
        <PopoverTrigger as="span">
          <Button v-if="link?.url" size="sm" icon target="_blank" variant="ghost" :href="link.url">
            <Icon :icon="link?.icon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>{{ link?.text }}</PopoverContent>
      </Popover>
    </CardHeader>
    <CardDescription v-if="info.vendor" tag="span" class="mt-0">
      created by: {{ info.vendor }}
    </CardDescription>
    <CardContent>
      <div v-if="info.notes" v-html="$mdRenderer.render(info?.notes)" />
      <div v-if="info.description" v-html="$mdRenderer.render(info?.description)" />
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Icon } from 'lucide-vue-next';
import type { Container } from '#docker/types/containers/yachtContainers';

const { $mdRenderer } = useNuxtApp();

interface Props {
  info: Container['info'];
}

const { info } = defineProps<Props>();

const links = [
  info.url ? { text: 'website', icon: 'mdi-open-in-new', url: info.url } : null,
  info.docs ? { text: 'documentation', icon: 'mdi-file-document', url: info.docs } : null,
  info.source ? { text: 'source', icon: 'mdi-github', url: info.source } : null,
].filter(Boolean);
</script>

<style></style>
