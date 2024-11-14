<template>
  <Card>
    <CardHeader>
      <CardTitle>Docker Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <Section title="Prune">
        <p>Delete unused images, volumes, networks, and containers.</p>
        <Button>Images</Button>
        <Button>Networks</Button>
        <Button>Volumes</Button>
        <Button>Containers</Button>
      </Section>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
