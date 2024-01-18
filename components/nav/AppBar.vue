<template>
  <div class="min-w-screen max-h-32 items-center justify-between md:justify-center flex py-5 border-b px-5">
    <div class="mr-5 align-middle md:hidden">
      <Button @click="$emit('toggle')" variant="ghost" size="icon">
        <Icon name="material-symbols:menu" class="w-8 h-8" />
      </Button>
    </div>
    <div>
      <svgo-yacht-text class="w-52" :fontControlled="false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['toggle'])
defineProps(['links'])
</script>

<style>
.app-bar {
  color: rgba(var(--v-theme-primary), 0.9) !important;
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>