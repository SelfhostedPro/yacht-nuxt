<template>
    <slot name="toolbar" />
    <v-container fluid class="d-flex pa-0">
        <v-sheet class="settings-sidebar overflow-scroll" color="surface" elevation="2">
            <slot name="sidebar"></slot>
        </v-sheet>
        <v-sheet class="settings-content flex-grow-1 overflow-scroll" color="surface">
            <slot name="content"></slot>
        </v-sheet>
    </v-container>
</template>

<style scoped>
.settings-sidebar {
    width: 200px;
    height: 80vh;
}

.settings-content {
    height: 80vh;
}
</style>