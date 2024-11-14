<template>
  <Card color="foreground">
    <CardHeader> HI 
      <!-- {{ user?.username }}  -->
    </CardHeader>
    <!-- <v-card-text class="bg-black">
      <pre v-if="messages.length > 0" v-for="message in messages">{{ message }}</pre>
      <pre v-else>no messages yet</pre>
    </v-card-text> -->
  </Card>
</template>

<script lang="ts" setup>
// import NewLayout from '#ui/app/layouts/new.vue'
// const user = useUser();
definePageMeta({
  name: 'Dashboard',
})
</script>

<style></style>
