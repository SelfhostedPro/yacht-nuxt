<template>
    <SettingsSection title="Basic">
        <v-text-field v-model="name" :error-messages="nameErrors" label="name" clearable />
    </SettingsSection>
</template>

<script setup lang="ts">
interface Props {
    settings: YachtConfig,
}
const { settings } = defineProps<Props>();
const { value: name, errorMessage: nameErrors } = useField<YachtConfig['name']>('name')

</script>