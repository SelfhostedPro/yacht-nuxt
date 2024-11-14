
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
} from '@/components/ui/sidebar'
// import ContainerList from '@/components/containers/list/ContainerList.vue'
// import ImageList from '@/components/images/ImageList.vue'
// import VolumeList from '@/components/volumes/VolumeList.vue'
// import NetworkList from '@/components/networks/NetworkList.vue'

const route = useRoute()
const router = useRouter()

// Initialize selectedIds from route query
const selectedIds = ref<string[]>([])
if (route.query.id) {
    selectedIds.value = [route.query.id as string]
}

// Computed properties
const title = computed(() => {
    switch (route.path) {
        case '/containers': return 'Containers'
        case '/images': return 'Images'
        case '/volumes': return 'Volumes'
        case '/networks': return 'Networks'
        default: return 'Resources'
    }
})

const content = computed(() => {
    switch (route.path) {
        case '/containers': return 'container-list'
        case '/images': return 'image-list'
        case '/volumes': return 'volume-list'
        case '/networks': return 'network-list'
        default: return null
    }
})

// Methods
const handleSelect = (ids: string[]) => {
    selectedIds.value = ids
    if (ids.length > 0) {
        router.push({ query: { ...route.query, id: ids[0] } })
    } else {
        const query = { ...route.query }
        delete query.id
        router.push({ query })
    }
}
</script>

<template>
    <SidebarHeader class="gap-3.5 border-b p-4">
        <div class="flex w-full items-center justify-between">
            <div class="text-base font-medium text-foreground">
                {{ title }}
            </div>
            <!-- <Label class="flex items-center gap-2 text-sm">
          <span>Active Only</span>
          <Switch class="shadow-none" />
        </Label> -->
        </div>
        <SidebarInput placeholder="Type to search..." />
    </SidebarHeader>
    <SidebarContent>
        <SidebarGroup class="px-0">
            <SidebarGroupContent>
                <component :is="content" :selected-ids="selectedIds" @select="handleSelect" />
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>
</template>