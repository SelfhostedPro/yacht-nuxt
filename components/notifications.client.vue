<template>
  <span v-if="notificationStore.notifications" v-for="notification, i in notificationStore.notifications">
    <v-snackbar v-model="snackbar[i]" :timeout="-1">
      {{ notification }}
    </v-snackbar>
  </span>
</template>

<script lang="ts" setup>
const snackbar: Ref<{ [key: number]: boolean }> = useState('snack-notifications')
const notificationStore = useNotificationsStore()
await callOnce(notificationStore.subscribe)
</script>

<style></style>