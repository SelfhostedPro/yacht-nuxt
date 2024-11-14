<template>
  <TransitionGroup enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
    <Card v-for="(fields, i) in arrayFields" :key="i" class="my-2">
      <CardContent class="p-4">
        <div class="flex items-center gap-4">
          <div class="flex-grow">
            <div class="grid gap-4" :class="{
              'grid-cols-1': breakpoints.smaller('sm'),
              'grid-cols-3': breakpoints.greater('sm')
            }">
              <div v-for="(field, i2) in fields" :key="i2" :class="{
                'col-span-3': field.label === 'Label' || breakpoints.smaller('sm'),
                'col-span-1': field.label !== 'Label' && breakpoints.greater('sm'),
                [field.cols ? `col-span-${field.cols}` : '']: field.cols,
                'order-5': field.type === 'description'
              }">
                <common-form-dynamic-string :field="field" />
              </div>
            </div>
          </div>

          <div class="flex-shrink-0">
            <Button variant="destructive" size="sm" class="h-8 w-8 p-0" @click="delRow(i)">
              <span class="sr-only">Delete row</span>
              <span class="text-lg">-</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import type { Field } from '#core/types/forms'
import type { CreateContainerForm } from '#docker/types/containers/create';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const arrayFields = defineModel<Field[][]>("arrayFields", { required: true });
const emit = defineEmits(['validate'])

interface Props {
  path: keyof CreateContainerForm;
}

const { path } = defineProps<Props>()
const form = useFormValues<CreateContainerForm>()

const delRow = (i: number) => {
  if (form.value[path] && Array.isArray(form.value[path])) {
    (form.value[path] as unknown[]).splice(i, 1)
    emit('validate');
  }
};
</script>
