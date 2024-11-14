<template>
  <div class="flex flex-col items-center space-y-8">
    <div class="w-full max-w-md">
      <Card class="p-6">
        <img
          class="mx-auto mb-8 h-32 w-auto"
          alt="Yacht logo"
          src="/icons/yacht/full.svg"
          style="filter: brightness(0)"
        />
        
        <component :is="wizard ? RegisterForm : LoginForm" />
      </Card>
    </div>
  </div>
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
