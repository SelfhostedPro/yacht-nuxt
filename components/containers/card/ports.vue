<template>
    <v-card-item class="d-flex flex-column items-center">
        <v-card-subtitle class="mx-auto text-center">PORTS</v-card-subtitle>
        <v-item-group show-arrows>
            <v-row no-gutters>
                <v-item v-for="port in disableIpv6(ports)" :key="port.containerPort">
                    <v-col>
                        <v-tooltip :text="port.hostPort ? `Host Port: ${port.hostPort}` : 'Port not forwarded'">
                            <template v-slot:activator="{ props }">
                                <v-chip v-bind="props" label size="small" class="ma-1"
                                    :color="port.hostPort ? 'primary' : 'error'">
                                    {{
                                        port.containerPort }}</v-chip>
                            </template>
                        </v-tooltip>
                    </v-col>
                </v-item>
            </v-row>
        </v-item-group>
    </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerPort } from '~/types/containers/yachtContainers';
const props = defineProps<{ ports: ContainerPort[] }>()
const disableIpv6 = (ports: ContainerPort[]) => {
    return ports.filter((port) => port.hostIP !== '::')
}
</script>