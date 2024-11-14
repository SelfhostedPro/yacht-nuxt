<template>
    <Card>
      <Tabs v-model="tab">
        <TabsList>
          <TabsTrigger value="0">Environment</TabsTrigger>
          <TabsTrigger value="1">Labels</TabsTrigger>
        </TabsList>
        <TabsContent value="0">
          <ul v-if="container.env && container.env.length">
            <li v-for="env in container.env" :key="env.split('=')[0]" class="text-no-wrap">
              <strong>{{ env.split('=')[0] }}</strong>: {{ env.split('=')[1] }}
            </li>
          </ul>
          <p v-else>No environment variables configured.</p>
        </TabsContent>
        <TabsContent value="1">
          <ul v-if="container.labels && Object.keys(container.labels).length">
            <li v-for="(value, label) in container.labels" :key="label" class="text-no-wrap">
              <strong>{{ label }}</strong>: {{ value }}
            </li>
          </ul>
          <p v-else>No labels configured.</p>
        </TabsContent>
      </Tabs>
    </Card>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { Card } from '@/components/ui/card'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import type { Container } from '#docker/types/containers/yachtContainers'
  
  interface Props {
    container: Container
  }
  defineProps<Props>()
  const tab = ref(0)
  </script>
  
  <style>
  /* Add any additional styling here */
  </style>
  