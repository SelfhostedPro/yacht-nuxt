<template>
  <v-btn-toggle class="pa-0 ma-0" multiple v-model="activeButtons">
    <v-btn
      value="hidden"
      class="h-50"
      size="x-small"
      :icon="activeButtons.includes('hidden') ? 'mdi-eye' : 'mdi-eye-off'"
    >
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts" setup>
const activeButtons = ref<string[]>([]);
const projectsStore = useProjectsStore();
const { filter, showHidden } = storeToRefs(projectsStore);

defineEmits(["toParent"]);

</script>

<style></style>
