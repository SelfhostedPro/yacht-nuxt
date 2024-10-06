<template>
  <v-app :theme="isDark ? 'LVDark' : 'LVLight'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
<script setup lang="ts">
const { isDark } = useCustomTheme();
</script>
