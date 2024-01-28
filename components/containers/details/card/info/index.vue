<template>
  <v-card>
    <v-toolbar>
      <template v-slot:prepend>
        <v-avatar :image="container.info.icon || 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'" />
      </template>
      <v-toolbar-title>
        <v-tooltip :text="container.status" location="bottom">
          <template v-slot:activator="{ props }">
            <v-avatar class="ml-1" v-bind="props" :color="container.status == 'running' ? 'primary' : 'red'"
              size="6"></v-avatar>
          </template>
        </v-tooltip>
        {{ ' ' + container.name }}
      </v-toolbar-title>
      <template v-slot:extension>
        <containers-details-card-info-actions :container="container" :server="server" />
        <v-spacer />
        <v-btn :rounded="0" :icon="mdAndDown" color="info">
          <template v-if="!mdAndDown" v-slot:prepend>
            <v-icon icon="mdi-help-circle-outline" />
          </template>
          <v-icon v-if="mdAndDown" icon="mdi-help-circle-outline" />
          {{ !mdAndDown ? 'help' : undefined }}
        </v-btn>
        <v-btn :rounded="0" :icon="mdAndDown ? 'mdi-file-document-edit-outline' : undefined" color="warning">
          <template v-if="!mdAndDown" v-slot:prepend>
            <v-icon icon="mdi-file-document-edit-outline" />
          </template>
          <v-icon v-if="mdAndDown" icon="mdi-file-document-edit-outline" />
          {{ !mdAndDown ? 'edit' : undefined }}
        </v-btn>
      </template>
    </v-toolbar>
    <v-row>
      <v-col :cols="mdAndDown ? 12 : 6">
        <containers-details-card-info-base :container="container" />
      </v-col>
      <v-divider v-if="Object.keys(container.info).length !== 1" :class="!mdAndDown ? 'mt-4' : null"
        :vertical="!mdAndDown" />
      <v-col :cols="mdAndDown ? 12 : 6">
        <containers-details-card-info-meta :info="container.info" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const { mdAndDown } = useDisplay()

interface Props {
  container: Container,
  server: string
}
defineProps<Props>();

</script>

<style></style>