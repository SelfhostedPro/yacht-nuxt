<template>
  <div v-for="author in authors" :key="author.name" class="inline-block">
    <Tooltip>
      <TooltipTrigger>
        <a v-if="author.url" :href="author.url" target="_blank" class="flex items-center">
          <img
            :src="author.avatar || `https://avatars.dicebear.com/api/initials/${author.name}.svg`"
            alt="Avatar"
            class="w-8 h-8 rounded-full"
          />
        </a>
        <div v-else class="flex items-center">
          <img
            :src="author.avatar || `https://avatars.dicebear.com/api/initials/${author.name}.svg`"
            alt="Avatar"
            class="w-8 h-8 rounded-full"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{{ author.name }}</span>
      </TooltipContent>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { YachtTemplate } from '#core/types/templates/yacht';

interface Props {
  authors: YachtTemplate['authors']
}
defineProps<Props>()
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
