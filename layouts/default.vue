<template>
  <div class="bg-background">
    <div>
      <div>
        <nav-sidebar v-if="!isMobile || sidebarOpen" :links="links" />
        <nav-app-bar @toggle="sidebarOpen = !sidebarOpen" :links="links" />
        <div
          :class="`container fixed top-20 ${sidebarLocked ? 'left-52 w-[calc(100%-13rem)]' : 'left-14 w-[calc(100%-3.5rem)]'} transition-all right-0 bottom-0  h-[calc(100%-5rem)]`">
          <slot />
        </div>
      </div>
    </div>
    <NotificationRoot />
  </div>
</template>
  
<script lang="ts" setup>
import NotificationRoot from '~/components/notificationRoot.vue';
// const notificationsStore = useNotificationsStore()
// const { connected } = storeToRefs(notificationsStore)
const { isMobile } = useDevice()
const sidebarOpen = ref(false)

const sidebarLocked = useState('sidebarLocking', () => false)


export interface Link {
  to?: string
  icon: string
  text: string
  divider?: boolean
  subLinks?: Link[]
}
const links = [
  {
    to: "/",
    icon: "mdi:view-dashboard",
    text: "Dashboard",
    divider: true
  },
  {
    text: "Containers",
    to: "/containers",
    icon: "mdi:application"
  },
  {
    text: "Templates",
    // to: "/templates",
    icon: "mdi:folder"
  },
  {
    text: "Projects",
    // to: "/projects",
    icon: "mdi:book-open"
  },
  {
    icon: "mdi:cube-outline",
    text: "Resources",
    subLinks: [
      {
        text: "Images",
        // to: "/resources/images",
        icon: "mdi:disc"
      },
      {
        text: "Volumes",
        // to: "/resources/volumes",
        icon: "mdi:database"
      },
      {
        text: "Networks",
        // to: "/resources/networks",
        icon: "mdi:network"
      }
    ]
  },
  {
    // to: "/settings",
    icon: "mdi:cog",
    text: "Settings"
  }
]
</script>