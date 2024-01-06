<template>
    <v-card-item class="px-2 pb-0" density="compact"
        :prepend-avatar="container.info.icon ? container.info.icon : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'">
        <v-card-title>
            <v-tooltip :text="container.state" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-avatar class="ml-1" v-bind="props" :color="container.status == 'running' ? 'primary' : 'red'"
                        size="6"></v-avatar>
                </template>
            </v-tooltip>
            {{ ' ' + container.name }}
        </v-card-title>
        <v-card-subtitle>{{ 'image: ' + container.image }}</v-card-subtitle>
        <v-card-subtitle>{{ 'id: ' + container.shortId }}</v-card-subtitle>
    </v-card-item>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const props = defineProps<{ container: Container }>()
</script>