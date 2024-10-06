<template>
  <v-card-title class="text-center"> first time setup </v-card-title>
  <v-card-text>
    <form>
      <v-text-field
        v-model="username.value.value"
        label="username"
        append-inner-icon="mdi-account-circle"
        :error-messages="username.errorMessage.value"
      />
      <v-text-field
        v-model="password.value.value"
        label="password"
        type="password"
        append-inner-icon="mdi-shield-key"
        :error-messages="password.errorMessage.value"
      />
      <v-text-field
        @keyup.enter="onSubmit"
        v-model="confirm.value.value"
        label="confirm"
        type="password"
        append-inner-icon="mdi-shield-key"
        :error-messages="confirm.errorMessage.value"
      />
      <v-spacer />
      <v-btn class="mt-2" block color="primary" elevation="4" @click="onSubmit">
        setup
      </v-btn>
      <span v-if="error">{{ error }}</span>
    </form>
  </v-card-text>
</template>

<script setup lang="ts">
import { RegisterUserFormSchema } from "#imports";
const settingsStore = useSettingsStore();
const { handleSubmit, handleReset } = useForm({
  initialValues: {
    username: "",
    password: "",
    confirm: "",
  },
  validationSchema: toTypedSchema(RegisterUserFormSchema),
  keepValuesOnUnmount: true,
});
const error = ref<string | null>(null);
const username = useField("username");
const password = useField("password");
const confirm = useField("confirm");

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch("/api/auth/wizard", {
      method: "POST",
      body: values,
    });
    navigateTo("/");
  } catch (err) {
    error.value = JSON.stringify(err);
  }
});

const submit = async () => {
  // if (props.registration){
  //     authStore.userRegister({username: username.value, password: password.value, admin: true})
  // } else {
  //     authStore.userLogin({username: username.value, password: password.value})
  // }
};
</script>
