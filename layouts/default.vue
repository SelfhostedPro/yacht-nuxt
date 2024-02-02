<template>
  <v-app>
    <nav-sidebar :links="links" />
    <nav-app-bar :links="links" />
    <v-main>
      <v-container fluid>
        <NuxtLoadingIndicator />
        <slot />
      </v-container>
    </v-main>
    <notifications />
  </v-app>
</template>
  
<script lang="ts" setup>
const links = [
  {
    to: "/",
    icon: "mdi-view-dashboard",
    text: "Dashboard",
    divider: true
  },
  {
    text: "Containers",
    to: "/containers",
    icon: "mdi-application"
  },
  {
    text: "Templates",
    to: "/templates",
    icon: "mdi-folder"
  },
  // {
  //   text: "Projects",
  //   to: "/projects",
  //   icon: "mdi-book-open"
  // },
  {
    icon: "mdi-cube-outline",
    text: "Resources",
    subLinks: [
      {
        text: "Images",
        to: "/resources/images",
        icon: "mdi-disc"
      },
      {
        text: "Volumes",
        to: "/resources/volumes",
        icon: "mdi-database"
      },
      {
        text: "Networks",
        to: "/resources/networks",
        icon: "mdi-network"
      }
    ]
  },
  // {
  //   to: "/settings",
  //   icon: "mdi-cog",
  //   text: "Settings"
  // }
]
</script>