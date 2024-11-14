<template>
  <div class="space-y-4 w-full max-w-sm">
    <div class="text-center">
      <h2 class="text-2xl font-semibold">First Time Setup</h2>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">

      <!-- Username -->
      <FormField v-slot="{ componentField }" name="username">
        <FormItem v-auto-animate>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="text" placeholder="Enter username" />
          </FormControl>
          <FormMessage>
            {{ username.errorMessage.value }}
          </FormMessage>
        </FormItem>
      </FormField>

      <!-- Password -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem v-auto-animate>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="password" placeholder="Enter password" />
          </FormControl>
          <FormMessage>
            {{ password.errorMessage.value }}
          </FormMessage>
        </FormItem>
      </FormField>

      <!-- Confirm Password -->
      <FormField v-slot="{ componentField }" name="confirm">
        <FormItem v-auto-animate>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="password" placeholder="Confirm password" @keyup.enter="onSubmit" />
          </FormControl>
          <FormMessage>
            {{ confirm.errorMessage.value }}
          </FormMessage>
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full">
        Setup
      </Button>

      <p v-if="error" class="text-sm text-red-500 mt-2">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { RegisterUserFormSchema } from "#auth/types/auth";

const { handleSubmit } = useForm({
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
</script>
