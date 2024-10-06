<template>
  <v-toolbar
    v-bind="$attrs"
    align-center
  >
    <v-toolbar-title>
      {{ title || null
      }}
    </v-toolbar-title>
    <v-toolbar-items class="text-center">
      <slot name="btns" />
      <v-tooltip
        v-if="closable"
        :text="'maximize'"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            @click="$emit('maximize')"
          >
            <v-icon>mdi-fullscreen</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-btn
        v-if="closable"
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>
<script setup lang="ts">
defineEmits(['close', 'maximize'])
interface Props {
  closable?: boolean,
  title?: string,
  color?: string
}
defineProps<Props>()
</script>