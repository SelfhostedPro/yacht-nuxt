<template>
  <ToggleGroup v-model="activeButtons" class="p-0 m-0" type="multiple">
    <ToggleGroupItem value="hidden" class="h-12 text-xs">
      <component :is="activeButtons.includes('hidden') ? EyeIcon : EyeOffIcon" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next'

const activeButtons = ref<string[]>([])

defineEmits(['toParent'])
</script>

<style></style>
