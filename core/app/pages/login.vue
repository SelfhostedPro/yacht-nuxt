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
import LoginForm from "#core/app/components/auth/LoginForm.vue";
import RegisterForm from "#core/app/components/auth/RegisterForm.vue";
import { useSettingsStore } from "#core/app/stores/settings";
const settingStore = useSettingsStore();
const {
  details: {
    value: { wizard },
  },
} = storeToRefs(settingStore);
useAsyncData("details", () => settingStore.fetchDetails());
definePageMeta({
  layout: "login",
});
</script>
