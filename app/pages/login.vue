<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col>
        <v-card class="mx-auto" max-width="400px" color="foreground">
          <v-img
            class="mx-auto mt-5 mb-5"
            max-height="200"
            alt="Yacht logo"
            src="/icons/yacht/full.svg"
            style="filter: brightness(5)"
          />
          <component :is="wizard ? RegisterForm : LoginForm" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";
import RegisterForm from "~/components/auth/RegisterForm.vue";
const settingStore = useSettingsStore();
const {
  loading,
  details: {
    value: { wizard, auth },
  },
} = storeToRefs(settingStore);
useAsyncData("details", () => settingStore.fetchDetails());
definePageMeta({
  layout: "login",
});
</script>
