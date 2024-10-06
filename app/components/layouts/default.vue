<script lang="ts" setup>
const { links } = defineProps<Props>();
const route = useRoute();
interface Props {
  links: Link[];
}
export interface Link {
  to?: string;
  icon: string;
  text: string;
  subLinks?: Link[];
  divider?: boolean;
}
</script>

<template>
    <slot name="nav">
      <lazy-nav-sidebar :links="links">
        <template #logo>
          <slot name="sidebar-logo" />
        </template>
      </lazy-nav-sidebar>
      <lazy-nav-appbar :links="links">
        <template #logo>
          <slot name="appbar-logo" />
        </template>
        <template #append>
          <slot name="appbar-append" />
        </template>
      </lazy-nav-appbar>
    </slot>
    <v-main>
      <v-container fluid>
        <NuxtLoadingIndicator />
        <slot />
      </v-container>
    </v-main>
    <!-- <NotificationsSonner />
      <NotificationsProgress /> -->
</template>
