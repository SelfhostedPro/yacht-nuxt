<template>
  <v-card-text>
    <v-form fast-fail>
      <v-text-field v-model="username.value.value" label="username" append-inner-icon="mdi-account-circle"
        @keyup.enter="submit" />
      <v-text-field v-model="password.value.value" label="password" type="password" append-inner-icon="mdi-shield-key"
        @keyup.enter="submit" />
    </v-form>
    <v-spacer />
    <v-btn block color="primary" elevation="4" @click="submit">
      submit
    </v-btn>
    <span>{{ error }}</span>
  </v-card-text>
</template>

<script setup lang="ts">
import { LoginUserFormSchema } from '~/types/auth';

const { handleSubmit, handleReset } = useForm({
  initialValues: {
    username: "",
    password: "",
  },
  validationSchema: toTypedSchema(LoginUserFormSchema),
  keepValuesOnUnmount: true
})

const username = useField('username')
const password = useField('password')
const error = ref<string | null>(null);



const submit = handleSubmit(async (values) => {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: values
    });
    await navigateTo('/')
  } catch (err) {
    error.value = JSON.stringify(err)
  }
})

</script>