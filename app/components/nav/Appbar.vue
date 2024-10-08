<template>
  <v-app-bar class="app-bar" height="60" elevation="8" scroll-behavior="hide" scroll-threshold="1" color="primary">
    <template #prepend>
      <!-- <v-app-bar-title>{{ clientConfig?.name || 'Yacht' }}</v-app-bar-title> -->
    </template>
    <template #append>
      <slot name="append" />
      <v-btn-group v-if="!smAndDown">
        <v-btn variant="elevated" color="surface" @click="settingsDialog = !settingsDialog">settings</v-btn>
        <v-btn v-if="user" variant="elevated" color="surface" @click.stop="logout">
          logout
        </v-btn>
      </v-btn-group>
      <v-app-bar-nav-icon v-if="smAndDown" color="grey-lighten-5" variant="text" @click.stop="drawer = !drawer" />
    </template>
    <v-app-bar-title>
      <slot name="logo" />
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app location="right" temporary>
    <v-list nav dense>
      <div v-for="(link, i) in links" :key="i">
        <v-list-item v-if="!link.subLinks" :to="link.to" :title="link.text" :prepend-icon="link.icon" exact
          class="mt-1" />
        <v-list-group v-else :key="link.text" :prepend-icon="link.icon" :value="false">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="link.text" :prepend-icon="link.icon" />
          </template>
          <v-list-item v-for="sublink in link.subLinks" :key="sublink.text" :to="sublink.to" :title="sublink.text"
            :prepend-icon="sublink.icon" exact class="mb-1" />
        </v-list-group>
        <v-divider />
      </div>
    </v-list>
  </v-navigation-drawer>
  <v-dialog v-model="settingsDialog" transition="dialog-bottom-transition" min-width="70%" min-height="60%" width="auto" :scrim="false">
    <v-card>
      <v-toolbar color="primary" title="Settings" class="text-capitalize">
        <template #append>
          <v-btn icon="mdi-close" @click="settingsDialog = !settingsDialog"/>
        </template>
      </v-toolbar>
        <settings />
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
import { useUser } from "~~/modules/auth/runtime/composables/user";
import { useClientConfig } from "~~/modules/config/runtime/composables/client-config";
const settingsDialog = ref(false)
const clientConfig = useClientConfig()
const user = useUser();
defineProps(["links"]);
const drawer = ref(false);
const { smAndDown } = useDisplay();

const logout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  navigateTo("/login");
};
</script>

<style>
/* .app-bar {
  color: rgba(var(--v-theme-primary), 0.9) !important;
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
} */
</style>
