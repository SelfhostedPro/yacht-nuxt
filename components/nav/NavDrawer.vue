<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    location="bottom"
    temporary
  >
    <v-list :items="links" />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
defineProps(['links'])
const drawer = ref(false)

defineExpose({
    drawer
})
</script>