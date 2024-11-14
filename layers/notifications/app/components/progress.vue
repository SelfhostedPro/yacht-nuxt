<template>
  <Card :class="[isMobile ? 'w-full' : 'w-[30vw]']" class="transition-all duration-200">
    <CardHeader v-if="title">
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <TransitionGroup name="expand">
        <div v-for="(item, i) in items" :key="i" class="space-y-2 mb-4">
          <div class="flex justify-between text-sm text-muted-foreground">
            <span>{{ item.status }}</span>
            <span v-if="item.current && item.total">
              {{
                bytes
                  ? `${formatBytes(item.current)} / ${formatBytes(item.total)}`
                  : `${item.current} / ${item.total}`
              }}
            </span>
          </div>
          <Progress
            :model-value="
              ((item.current ||
                (item.status === 'Waiting' || item.status === 'Pulling fs layer'
                  ? 0
                  : 100)) /
                (item.total || 100)) *
              100
            "
          />
        </div>
      </TransitionGroup>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useProgressStore } from '#notifications/app/stores/progressStore';
import type { ProgressItems } from '#notifications/types/progress';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { Progress } from '#ui/app/components/ui/progress'
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm') // smaller than 640px

defineEmits(["closeToast"]);

interface Props {
  id: string;
  testTitle?: string;
  testProgress?: ProgressItems;
}

const progressStore = useProgressStore();
const { progress } = storeToRefs(progressStore);
const { id, testProgress, testTitle } = defineProps<Props>();

const { title, items, bytes } = progress.value[id] || {
  title: testTitle,
  items: testProgress,
  bytes: false,
};
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
