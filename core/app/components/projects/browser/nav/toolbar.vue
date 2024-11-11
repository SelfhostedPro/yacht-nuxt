<template>
  <v-btn-toggle v-model="activeButtons" class="pa-0 ma-0" multiple>
    <v-btn value="hidden" class="h-50" size="x-small"
      :icon="activeButtons.includes('hidden') ? 'mdi-eye' : 'mdi-eye-off'" />
  </v-btn-toggle>
</template>

<script lang="ts" setup>
const activeButtons = ref<string[]>([]);

defineEmits(["toParent"]);

</script>

<style></style>
