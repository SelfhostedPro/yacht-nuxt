<template>
    <v-col cols="12">
        <v-sheet :color="color || 'foreground'" class="px-5">
            <slot name="header">
                <v-card-title v-if="title" color="secondary">{{ title }}</v-card-title>
            </slot>
            <slot />
        </v-sheet>
    </v-col>
</template>

<script setup lang="ts">
interface Props {
    title?: string;
    color?: string;
}
const { title } = defineProps<Props>();
</script>