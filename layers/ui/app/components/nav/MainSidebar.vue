<script setup lang="ts">
import {
    Boxes,
    Container,
    Database,
    Network,
    Command,
    Server,
} from 'lucide-vue-next'
// import NavUser from '#ui/app/components/nav/NavUser.vue'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '#ui/app/components/ui/sidebar'

const navItems = [
    {
        title: 'Containers',
        url: '/containers',
        icon: Container,
    },
    {
        title: 'Images',
        url: '/images',
        icon: Boxes,
    },
    {
        title: 'Volumes',
        url: '/volumes',
        icon: Database,
    },
    {
        title: 'Networks',
        url: '/networks',
        icon: Network,
    },
    {
        title: 'Servers',
        url: '/servers',
        icon: Server,
    },
]

// Props
interface Props {
    user: {
        name: string
        email: string
        avatar: string
    }
}

defineProps<Props>()
</script>

<template>
    <Sidebar collapsible="none" class="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard" size="lg" class="md:h-8 md:p-0">
                        <NuxtLink to="/">
                            <div
                                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Command class="size-4" />
                            </div>
                            <!-- <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">Docker UI</span>
                                <span class="truncate text-xs">Local</span>
                            </div> -->
                        </NuxtLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent class="px-1.5 md:px-0">
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in navItems" :key="item.title">
                            <SidebarMenuButton :tooltip="item.title" :is-active="$route.path === item.url"
                                class="px-2.5 md:px-2">
                                <NuxtLink :to="item.url">
                                    <component :is="item.icon" class="size-4" />
                                    <!-- <span>{{ item.title }}</span> -->
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <!-- <NavUser :user="user" /> -->
        </SidebarFooter>
    </Sidebar>
</template>