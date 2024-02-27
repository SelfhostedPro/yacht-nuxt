<template>
  <v-timeline v-if="!smAndDown" class="my-3" truncate-line="both" side="end" line-inset="8">
    <v-timeline-item v-for="step, i in steps"
      :dot-color="step.errors && step.errors.length > 0 ? 'error' : currentStep >= i ? 'primary' : 'secondary'" :key="i"
      @click="currentStep = i" :class="currentStep === i ? 'font-weight-regular' : 'font-weight-light text-disabled'">
      <template #icon>
        <v-tooltip location="top end" v-if="step.errors" activator="parent">
          <v-card-text v-for="error in step.errors">{{ error }}</v-card-text>
        </v-tooltip>
      </template>
      <v-fade-transition hide-on-leave>
        <v-alert v-if="currentStep === i" color="foreground" :rounded="0" :title="step.title" :text="step.description" />
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
import type { CreateContainerForm } from '~/types/containers/create';
const { smAndDown } = useDisplay()
const errors = useFormErrors()
const form = useFormValues<CreateContainerForm>()
const currentStep = defineModel<number>('step', { default: 0 })

function getErrors(paths: string[]) {
  let fieldErrors: string[] = [];
  for (const path of paths) {
    const errorsForPath = Object.entries(errors.value).reduce((acc, [key, value]) => {
      if (key.startsWith(path)) {
        fieldErrors.push(`${key}: ${value}`);
      }
      return acc;
    }, []);
    fieldErrors = [...fieldErrors, ...errorsForPath];
  }
  return fieldErrors.length > 0 ? fieldErrors : undefined;
}


const steps = computed(() => {
  return [
    { title: 'base', description: 'Basic information about your container.', paths: ['image', 'name', 'restart', 'server'] },
    { title: 'info', description: 'Information that will be added to the labels of your container', paths: ['info'] },
    { title: 'networking', description: 'Networking configuration for your container.', paths: ['network_mode', 'ports'] },
    { title: 'storage', description: 'Storage configuration for your container.', paths: ['mounts'] },
    { title: 'environment', description: 'Environment variables for your container.', paths: ['env'] },
    { title: 'advanced', description: `Advanced container settings. Only change if you need to.`, paths: ['capabilities', 'command', 'limits', 'sysctls', 'devices'] },
    { title: 'preview', description: `Preview your container before deploying.` },
  ].map(step => ({
    ...step,
    errors: step.paths ? getErrors(step.paths) : undefined,
  }));
});

watchEffect(() => {
  steps.value.forEach(step => {
    step.errors = step.paths ? getErrors(step.paths) : undefined;
  });
});



</script>

<style></style>~/shared/containers/create