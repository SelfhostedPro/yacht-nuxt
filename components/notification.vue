<template>
    <Alert :class="`max-w-[50vw] flex justify-around items-center gap-5 p-5 ${colors[item.props['level']] ? '' : ''} `">
        <div>
            <Icon class="w-6 h-6 m-auto" :name="icons[item.type]" />
        </div>
        <div>
            <AlertTitle>{{ item.title }}</AlertTitle>
            <AlertDescription>{{ item.message }}</AlertDescription>
        </div>
        <div class="flex">
            <Button variant="ghost" @click="item.clear()">clear</Button>
        </div>
    </Alert>
</template>

<script lang="ts" setup>
import type { Notification } from '~/types/notifications';
import type { NotivueItem } from 'notivue'

defineProps<{
    item: NotivueItem<Notification>
}>()

const colors = {
  info: 'secondary',
  success: 'primary',
  warn: 'tertiary',
  error: 'error',
  debug: 'secondary',
}

const icons = {
  info: 'material-symbols:info-outline',
  success: 'material-symbols:check-circle-outline',
  warning: 'material-symbols:warning-outline-rounded',
  error: 'material-symbols:error-outline-rounded',
  promise: 'material-symbols:hourglass-top',
  'promise-resolve': 'material-symbols:check-circle-outline',
  'promise-reject': 'material-symbols:error-outline-rounded'
}
</script>