<template>
  <v-card color="foreground">
    <v-card-title> HI 
      <!-- {{ user?.username }}  -->
    </v-card-title>
    <!-- <v-card-text class="bg-black">
      <pre v-if="messages.length > 0" v-for="message in messages">{{ message }}</pre>
      <pre v-else>no messages yet</pre>
    </v-card-text> -->
  </v-card>
</template>

<script lang="ts" setup>
// const user = useUser();
definePageMeta({
  name: 'Dashboard'
})
</script>

<style></style>
