<template>
  <v-timeline
    v-if="!smAndDown"
    class="my-3"
    truncate-line="both"
    side="end"
    line-inset="8"
  >
    <v-timeline-item
      v-for="step, i in steps"
      :key="i"
      @click="currentStep = i"
    >
      <v-fade-transition hide-on-leave>
        <v-alert
          v-if="currentStep === i"
          color="foreground"
          :rounded="0"
          :title="step.title"
          :text="step.description"
        />
      </v-fade-transition>
      <v-fade-transition hide-on-leave>
        {{ currentStep !== i ? step.title : null }}
      </v-fade-transition>
    </v-timeline-item>
  </v-timeline>
  <div v-else>
        <v-card-title>{{ steps[currentStep].title }}</v-card-title>
        <v-card-text>{{ steps[currentStep].description }}</v-card-text>
    </div>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay()
const currentStep = defineModel<number>('step', {default: 0})
  const steps = [
    { title: 'base', description: 'Basic information about your container.' },
    { title: 'info', description: 'Information that will be added to the labels of your container' },
    { title: 'networking', description: 'Networking configuration for your container.' },
    { title: 'storage', description: 'Storage configuration for your container.' },
    { title: 'environment', description: 'Environment variables for your container.' },
    { title: 'advanced', description: `Advanced container settings. Only change if you need to.` },
    { title: 'preview', description: `Preview your container before deploying.` }
]

</script>

<style>

</style>