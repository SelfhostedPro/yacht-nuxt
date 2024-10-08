<template>
    <v-sheet>
        <v-card>
            <v-card-title color="secondary">Prune</v-card-title>
            <v-card-text>
                Delete unused images, volumes, networks, and containers.
            </v-card-text>
            <v-btn-group>
                <v-btn> images </v-btn>
                <v-btn> networks </v-btn>
                <v-btn> volumes </v-btn>
                <v-btn> containers </v-btn>
            </v-btn-group>
        </v-card>
    </v-sheet>
</template>

<script lang="ts" setup></script>

<style></style>