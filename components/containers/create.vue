<template>
  <div>
    <v-btn
      icon
      color="primary"
      @click="dialog = true"
    >
      <v-icon icon="mdi-plus" />
    </v-btn>

    <v-dialog
      v-model="dialog"
      persistent
      :fullscreen="maximize"
      :width="maximize ? undefined : '80vw'"
      height="80vh"
      scrollable
    >
      <template #default>
        <containers-create-card
          :maximize="maximize"
          @close="dialog = false"
          @maximize="maximize = !maximize"
        />
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
const maximize = ref(false)
const dialog = ref(false)

</script>

<style></style>