<template>
  <div class="space-y-4 w-full max-w-sm">
    <form @submit.prevent="submit" class="space-y-4">

      <!-- Username -->
      <FormField v-slot="{ componentField }" name="username">
        <FormItem v-auto-animate>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="text" placeholder="Enter username" @keyup.enter="submit" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Password -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem v-auto-animate>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="password" placeholder="Enter password" @keyup.enter="submit" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full">
        Sign In
      </Button>

      <p v-if="error" class="text-sm text-red-500 mt-2">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { LoginUserFormSchema } from '~~/layers/auth/types/auth';
import type { User } from '#auth/types/user';

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
  } catch (e) {
    /* Don't do anything here, just surpress duplicate 401 error notification */
  }
});
</script>
