<template>
    <v-card-item>
        <v-card-subtitle class="mx-auto text-center">PORTS</v-card-subtitle>
        <v-slide-group show-arrows>
            <v-slide-group-item v-for="port in ports" :key="port.containerPort">
                <v-btn elevation="4" variant="tonal" size="small" class="ma-1" :color="port.hostPort ? 'primary' : 'error'">
                    {{
                        port.hostPort ? port.hostPort : port.containerPort }}</v-btn>
            </v-slide-group-item>
        </v-slide-group>
    </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerPort } from '~/types/containers/yachtContainers';
const props = defineProps<{ ports: ContainerPort[] }>()
</script>