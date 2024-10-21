<template>
    <v-card elevation="10" class="mb-4">
      <v-card-title>Basic Settings</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          label="Name"
          clearable
        />
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  interface Props {
    settings: YachtConfig,
  }
  const { settings } = defineProps<Props>();
  const { value: name, errorMessage: nameErrors } = useField<YachtConfig['name']>('name')
  </script>