<template>
  <v-card-text>
    <v-form fast-fail>
      <v-text-field
        v-model="username.value.value"
        label="username"
        append-inner-icon="mdi-account-circle"
        @keyup.enter="submit"
      />
      <v-text-field
        v-model="password.value.value"
        label="password"
        type="password"
        append-inner-icon="mdi-shield-key"
        @keyup.enter="submit"
      />
    </v-form>
    <v-spacer />
    <v-btn block color="primary" elevation="4" @click="submit"> submit </v-btn>
    <span>{{ error }}</span>
  </v-card-text>
</template>

<script setup lang="ts">
import { LoginUserFormSchema } from '~~/modules/auth/types/auth';
import type { User } from '~~/modules/auth/types/user';

const { handleSubmit } = useForm({
  initialValues: {
    username: "",
    password: "",
  },
  validationSchema: toTypedSchema(LoginUserFormSchema),
  keepValuesOnUnmount: true,
});

const username = useField("username");
const password = useField("password");
const error = ref<string | null>(null);
const user = useUser();

const submit = handleSubmit(async (values) => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: values,
    });
    // const data = await useRequestFetch()<User | null>("/api/auth/me");
    // if (data && user.value) {
    //   user.value = data;
    // }
    await navigateTo("/");
  } catch (err) {
    error.value = JSON.stringify(err);
  }
});

onMounted(async () => {
  const config = useClientConfig();
  if (config.value?.auth === false) await navigateTo("/");
  try {
    const data = await useRequestFetch()<User | null>("/api/auth/me");
    if (data) {
      user.value = data;
      await navigateTo("/");
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    /* Don't do anything here, just surpress duplicate 401 error notification */
  }
});
</script>
