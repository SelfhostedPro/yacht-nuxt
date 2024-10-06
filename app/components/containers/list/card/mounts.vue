<template>
  <v-card-item class="d-flex flex-column items-center">
    <v-card-subtitle class="mx-auto text-center">
      MOUNTS
    </v-card-subtitle>
    <v-item-group
      show-arrows
      class="mx-auto"
    >
      <v-row no-gutters>
        <v-item
          v-for="mount in mounts"
          :key="mount.destination"
        >
          <v-col>
            <v-tooltip
              location="bottom"
              :text="mount.source ? `host: ${mount.source}` : 'not mounted'"
            >
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  label
                  size="small"
                  class="ma-1"
                  :color="mount.source ? 'primary' : 'error'"
                >
                  {{
                    mount.destination
                  }}
                </v-chip>
              </template>
            </v-tooltip>
          </v-col>
        </v-item>
      </v-row>
    </v-item-group>
  </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerMount } from '~/types/containers/yachtContainers';
defineProps<{ mounts: ContainerMount[] }>()
</script>