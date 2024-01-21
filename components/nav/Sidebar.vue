<template>
    <nav @mouseenter="hovered = true" @mouseleave="hovered = false"
        :class="`${locked ? 'w-52' : 'w-14 hover:w-52'} min-h-full transition-all ease-in-out fixed left-0 top-0 bottom-0 flex flex-col justify-start z-50 bg-surface-container`">
        <div class="mx-2 mt-2">
            <!-- logo -->
            <svgo-yacht-mini class="max-h-20 transition-all ease-in-out mx-auto dark:grayscale dark:brightness-200"
                :filled="true" :fontControlled="false" />
        </div>
        <div>
            <div :class="`border-b border-outline-variant overflow-hidden`">
                <div class="min-w-full transition-all ease-in-out whitespace-nowrap py-2">
                    <!-- Buttons for layout/theme -->
                    <NavThemeButton class="ml-2 mr-8 shadow-lg light:shadow-on-surface" />
                    <Toggle class="mr-auto light:shadow-lg light:shadow-on-surface" v-model="locked" variant="circle"
                        size="icon" @click.prevent="locked = !locked">
                        <Icon :name="locked ? 'material-symbols:lock' : 'material-symbols:lock-open'" />
                    </Toggle>
                </div>
            </div>
        </div>
        <div>
            <div v-for="(link, i) in links" :key="i" class="border-b border-outline-variant overflow-hidden">
                <!-- menu links -->
                <NuxtLink v-if="!link.subLinks" :to="link.to">
                    <Button variant="ghost" class="transition-all ease-in-out px-0 min-w-full rounded-none">
                        <Icon :name="link.icon" class="w-6 h-6 ml-4 mr-8" />
                        <p class="mr-auto">{{ link.text }}</p>
                    </Button>
                </NuxtLink>
                <!-- submenus -->
                <Collapsible v-else v-model:open="expanded[link.text]" :class="`overflow-hidden`">
                    <CollapsibleTrigger
                        class="inline-flex whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 py-2 hover:bg-secondary hover:text-on-secondary">
                        <Icon class="w-6 h-6 ml-4 mr-8" :name="link.icon" />
                        <p>{{ link.text }}</p>
                        <Icon class="w-6 h-6 ml-4 mr-8"
                            :name="expanded[link.text] ? 'material-symbols:keyboard-arrow-up' : 'material-symbols:keyboard-arrow-down'" />
                    </CollapsibleTrigger>
                    <CollapsibleContent
                        :class="`overflow-hidden ${expanded[link.text] ? 'bg-primary-container text-on-primary-container' : ''}`">
                        <!-- submenu links -->
                        <NuxtLink :to="sublink.to" v-for="(sublink, i) in link.subLinks" :key="i">
                            <Button variant="ghost"
                                class="rounded-none transition-all ease-in-out px-0 min-w-full hover:bg-surface-container hover:text-on-surface">
                                <Icon :name="sublink.icon" class="w-6 h-6 ml-4 mr-8" />
                                <p class="mr-auto">{{ sublink.text }}</p>
                            </Button>
                        </NuxtLink>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import type { Link } from '~/layouts/default.vue';
interface Props {
    links: Link[],
}
defineProps<Props>()
const hovered = useState('sidebarHovered', () => false)
const locked = useState('sidebarLocking', () => false)
// keep track of open submenus
const expanded = useState('sidebarCollapse', () => ({} as Record<string, boolean>))
</script>