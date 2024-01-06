<template>
    <v-card-item class="d-flex flex-column items-center">
        <v-card-subtitle class="mx-auto text-center">MOUNTS</v-card-subtitle>
        <v-item-group show-arrows class="mx-auto">
            <v-row no-gutters>
                <v-item v-for="mount in mounts" :key="mount.destination">
                    <v-col>
                        <v-chip label size="small" class="ma-1" color="warning"> {{
                            mount.destination
                        }}</v-chip>
                    </v-col>
                </v-item>
            </v-row>
        </v-item-group>
    </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerMount } from '~/types/containers/yachtContainers';
const props = defineProps<{ mounts: ContainerMount[] }>()
</script>