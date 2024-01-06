<template>
  <v-app-bar class="app-bar" elevation="8">
    <template v-slot:append>
      <v-app-bar-nav-icon v-if="mdAndDown" color="grey-lighten-5" variant="text"
        @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <v-img max-height="30" class="d-flex align-center mx-auto text-logo" :src="logo" style="filter: brightness(5)" />
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-if="mdAndDown" app v-model="drawer" location="right" temporary>
    <v-list nav dense>
      <div v-for="(link, i) in links" :key="i">
        <v-list-item v-if="!link.subLinks" :to="link.to" :title="link.text" :prepend-icon="link.icon" exact
          class="mt-1" />

        <v-list-group v-else :key="link.text" :prepend-icon="link.icon" :value="false">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="link.text" :prepend-icon="link.icon" />
          </template>
          <v-list-item v-for="sublink in link.subLinks" :to="sublink.to" :key="sublink.text" :title="sublink.text"
            :prepend-icon="sublink.icon" exact class="mb-1" />
        </v-list-group>
        <v-divider />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { textLogo } from "~/composables/logo"
import { useDisplay } from 'vuetify'

defineProps(['links'])
const drawer = ref(false)
const { mdAndDown, name } = useDisplay()
const logo = textLogo()
</script>

<style>
.app-bar {
  color: rgba(var(--v-theme-primary), 0.9) !important;
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>