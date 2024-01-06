<template>
    <v-card-item>
        <v-card-subtitle class="mx-auto text-center">MOUNTS</v-card-subtitle>
        <v-slide-group show-arrows>
            <v-slide-group-item v-for="mount in mounts" :key="mount.destination">
                <v-btn elevation="4" size="small" variant="tonal" class="ma-1" color='warning'> {{
                    mount.destination
                }}</v-btn>
            </v-slide-group-item>
        </v-slide-group>
    </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerMount } from '~/types/containers/yachtContainers';
const props = defineProps<{ mounts: ContainerMount[] }>()
</script>