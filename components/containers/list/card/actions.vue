<template>
  <v-card-item>
    <v-row>
      <v-col cols="12">
        <v-btn-group v-auto-animate divided class="d-flex justify-center">
          <containers-actions :size="xs ? 'small' : 'default'" :container="container" :server="server" @start-loading="emit('startLoading')"
            @stop-loading="emit('stopLoading')" />
        </v-btn-group>
      </v-col>
    </v-row>
  </v-card-item>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const { xs } = useDisplay()
defineProps<{ container: Container, server: string }>()
const emit = defineEmits(["startLoading", "stopLoading"])
</script>

<style></style>