<template>
  <Stepper v-if="!smAndDown">
    <StepperItem
      v-for="(step, i) in steps"
      :key="i"
      :step="i + 1"
      @click="currentStep = i"
    >
      <StepperTrigger>
        <StepperIndicator :class="step.errors && step.errors.length > 0 ? 'bg-red-500' : currentStep >= i ? 'bg-blue-500' : 'bg-gray-500'">
          {{ i + 1 }}
        </StepperIndicator>
        <StepperTitle :class="currentStep === i ? 'font-bold' : 'font-light text-gray-500'">
          {{ step.title }}
        </StepperTitle>
        <StepperDescription v-if="currentStep === i">
          {{ step.description }}
        </StepperDescription>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
  </Stepper>
  <div v-else>
    <Card>
      <CardHeader>
        <CardTitle>{{ steps[currentStep]?.title || '' }}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{{ steps[currentStep]?.description || '' }}</CardDescription>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndDown = breakpoints.smaller('md')
const errors = useFormErrors()
const currentStep = ref(0)

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

interface Step {
  title: string;
  description: string;
  paths?: string[];
  errors?: string[];
}

const steps = ref<Step[]>([
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
})))

watchEffect(() => {
  steps.value.forEach(step => {
    step.errors = step.paths ? getErrors(step.paths) : undefined;
  });
});
</script>

<style>
/* Add any necessary styles for shadcn-nuxt components */
</style>
