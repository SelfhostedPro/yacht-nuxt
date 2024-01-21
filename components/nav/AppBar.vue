<template>
  <div
    :class="`max-h-20 fixed top-0 right-0 transition-all ${sidebarLocked ? 'min-w-[calc(100%-13rem)]' : 'min-w-[calc(100%-0rem)]'} bg-primary-container`">
    <div class="items-center justify-between md:justify-center flex py-5 px-5">
      <div class="mr-5 align-middle md:hidden">
        <Button @click="$emit('toggle')" variant="ghost" size="icon">
          <Icon name="material-symbols:menu" class="w-8 h-8" />
        </Button>
      </div>
      <div>
        <svgo-yacht-text class="w-52" :fontControlled="false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['toggle'])
defineProps(['links'])
const sidebarLocked = useState('sidebarLocking', () => false)
</script>

<style>
.app-bar {
  color: rgba(var(--v-theme-primary), 0.9) !important;
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>