<template>
  <Button @mouseenter="isHovered = true" @mouseleave="isHovered = false" @click.prevent="next()" variant="circle"
    size="icon">
    <transition name="slide-fade" mode="out-in">
      <Icon :name="!isHovered ? currentMode[mode] : nextMode[mode]" />
    </transition>
  </Button>
</template>

<script lang="ts" setup>
import { useColorMode, useCycleList } from '@vueuse/core'
import { watchEffect } from 'vue-demi'
const currentMode = {
  dark: 'material-symbols:dark-mode',
  light: 'material-symbols:sunny',
  auto: 'material-symbols:brightness-auto'
}
const nextMode = {
  auto: 'material-symbols:dark-mode',
  dark: 'material-symbols:sunny',
  light: 'material-symbols:brightness-auto'
}
const isHovered = useState('themeButtonHovered', () => false)
const mode = useColorMode({
  emitAuto: true,
})
const { state, next } = useCycleList(['dark', 'light', 'auto'], { initialValue: mode })
watchEffect(() => mode.value = state.value as any)
</script>

<style></style>