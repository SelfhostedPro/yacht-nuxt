<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row>
      <v-col>
        <v-card
          class="mx-auto"
          max-width="400px"
          color="foreground"
        >
          <v-img
            class="mx-auto mt-5 mb-5"
            max-height="200"
            alt="Yacht logo"
            src="~/assets/yacht.svg"
            style="filter: brightness(5)"
          />
          <LoginForm :setup="true" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue"
definePageMeta({
  layout: 'login'
})
</script>