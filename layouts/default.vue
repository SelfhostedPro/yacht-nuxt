<template>
  <div>
    <nav-app-bar @toggle="sidebarOpen = !sidebarOpen" :links="links" />
    <div>
      <div class="bg-background">
        <div v-auto-animate class="flex min-h-screen">
          <nav-sidebar v-if="!isMobile || sidebarOpen" :links="links" />
          <div class="border-l">
            <div class="h-full min-w-full px-4 py-6 lg:px-8">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <v-app>
    <nav-sidebar :links="links" />
    <nav-app-bar :links="links" />
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <lazy-notifications />
  </v-app> -->
</template>
  
<script lang="ts" setup>
// const notificationsStore = useNotificationsStore()
// const { connected } = storeToRefs(notificationsStore)
const { isMobile } = useDevice()
const sidebarOpen = ref(false)
export interface Link {
  to: string
  icon: string
  text: string
  divider?: boolean
  subLinks?: Link[]
}
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
    // },
    // {
    //   text: "Templates",
    //   to: "/templates",
    //   icon: "mdi-folder"
    // },
    // {
    //   text: "Projects",
    //   to: "/projects",
    //   icon: "mdi-book-open"
    // },
    // {
    //   icon: "mdi-cube-outline",
    //   text: "Resources",
    //   subLinks: [
    //     {
    //       text: "Images",
    //       to: "/resources/images",
    //       icon: "mdi-disc"
    //     },
    //     {
    //       text: "Volumes",
    //       to: "/resources/volumes",
    //       icon: "mdi-database"
    //     },
    //     {
    //       text: "Networks",
    //       to: "/resources/networks",
    //       icon: "mdi-network"
    //     }
    //   ]
  },
  // {
  //   to: "/settings",
  //   icon: "mdi-cog",
  //   text: "Settings"
  // }
]
</script>