<template>
    <v-card>
        <v-tabs v-model="tab" color="primary" bg-color="foreground" grow>
            <v-tab rounded="0" value="0">environment</v-tab>
            <v-tab rounded="0" value="1">labels</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="0">
                <v-list v-if="container.env && container.env">
                    <v-list-item v-for="env in container.env" :key="env.split('=')[0]" class="text-no-wrap">
                        <v-list-item-title>{{ env.split('=')[0] }}</v-list-item-title>
                        <v-list-item-subtitle>{{ env.split('=')[1] }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-card-text v-else>No environment variables configured.</v-card-text>
            </v-window-item>
            <v-window-item value="1">
                <v-list v-if="container.labels && Object.keys(container.labels).length">
                    <v-list-item v-for="value, label in container.labels" :key="label" class="text-no-wrap">
                        <v-list-item-title>{{ label }}</v-list-item-title>
                        <v-list-item-subtitle>{{ value }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-card-text v-else>No labels configured.</v-card-text>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
  container: Container
}
defineProps<Props>()
const tab = ref(0)
</script>

<style>

</style>~/shared/containers/yachtContainers