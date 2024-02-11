<template>
  <v-navigation-drawer v-model="navbar" v-if="!mdAndDown" height="100vh" :permanent="locked" elevation="10" floating
    :expand-on-hover="true" :rail="!locked">
    <v-img max-height="100" class="mx-2 mt-2" src="~/assets/icons/yacht/mini.svg" style="filter: brightness(5)" />
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-btn @click="settingsExpanded = !settingsExpanded" icon class="my-2 mx-2" density="comfortable" v-bind="props">
          <v-icon :icon="settingsExpanded ? 'mdi-cog' : 'mdi-cog-outline'"></v-icon>
        </v-btn>
        <v-btn v-show="isHovering || settingsExpanded" class="my-2 mx-2" :icon="locked ? 'mdi-lock' : 'mdi-lock-open'"
          density="comfortable" @click="locked = !locked" />
      </template>
    </v-hover>


    <v-divider />
    <v-list nav dense>
      <div v-for="(link, i) in links" :key="i">
        <v-list-item v-if="!link.subLinks" :to="link.to" :title="link.text" :prepend-icon="link.icon" class="mt-1" />

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

    <template #append>
      <div>
        <v-btn size="large" variant="text" icon="mdi-file-document" target="_blank" href="https://yacht.sh" />
        <v-btn size="large" variant="text" icon="mdi-github" target="_blank"
          href="https://github.com/SelfhostedPro/Yacht" />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const settingsExpanded = ref(false)
const navbar = ref()
const { mdAndDown } = useDisplay()
defineProps(['links'])
const locked = ref(false)
</script>