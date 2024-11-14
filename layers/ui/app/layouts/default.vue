<script setup lang="ts">
import { computed } from 'vue'
// import ResourceSidebar from '#ui/app/components/nav/ResourceSidebar.vue'
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage
} from '#ui/app/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider } from '#ui/app/components/ui/sidebar'
import MainSidebar from '#ui/app/components/nav/MainSidebar.vue'

const route = useRoute()

const capitalizePathSegment = (path: string) => {
    const lastSegment = path.split("/").pop() || ""
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
}

const sidebarStyle = computed(() => ({
    '--sidebar-width': route.path === '/' ? 'var(--sidebar-width-icon)' : '350px'
}))

// const openPaths = [
//     '/containers',
//     '/images',
//     '/volumes',
//     '/networks',
//     '/servers',
// ]
const sampleData = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
}
</script>

<template>
    <SidebarProvider :open="false" :style="sidebarStyle">
        <Sidebar collapsible="icon" class="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row transition-all">
            <MainSidebar :user="sampleData.user" />
        </Sidebar>
        <SidebarInset>
            <header class="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <template v-if="route.path !== '/'">
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {{ capitalizePathSegment(route.path) }}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </template>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <slot />
        </SidebarInset>
    </SidebarProvider>
</template>