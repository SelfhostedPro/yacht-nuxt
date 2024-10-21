<template>
    <SettingsSection title="Theme">
        <v-select v-model="theme" :items="['dark', 'light']" :error-messages="themeErrors" label="theme" />
    </SettingsSection>
</template>

<script setup lang="ts">
const { value: theme, errorMessage: themeErrors } = useField<YachtConfig['theme']['type']>('theme.type')
</script>