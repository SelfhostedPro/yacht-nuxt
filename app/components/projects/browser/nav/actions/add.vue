<template>
  <v-btn color="primary">
    <v-icon icon="mdi-plus" />
    <v-menu
      v-model="menuOpen"
      activator="parent"
      :close-on-content-click="false"
    >
      <v-card>
        <v-list width="40vw">
          <v-list-item class="align-center">
            <v-row align="center">
              <v-col>
                <common-form-dynamic-string
                  :validateOnMount="false"
                  @keyup.enter="onSubmit"
                  block
                  dense
                  :field="urlField"
                  :hint="`will clone to ${cwd}`"
                />
              </v-col>
              <v-col cols="3">
                <v-btn
                  :loading="loading"
                  @click="onSubmit"
                  class="mt-1"
                  variant="plain"
                  :rounded="0"
                  append-icon="mdi-magnify"
                  text="check"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-auto-animate>
                <span
                  v-for="error, , i in errors"
                  :key="i"
                  v-html="error"
                  class="text-error"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-btn>
</template>
<script setup lang="ts">
import { string, z } from "zod";
import type { Field } from "~/types/forms";
const loading = ref(false);
const menuOpen = ref(false);
const emit = defineEmits(["added"]);
const { cwd } = defineProps<{ cwd: string }>();

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(z.object({ url: string().url() })),
});

const urlField = {
  label: "url",
  value: "url",
  placeholder: "https://github.com/selfhostedpro/yacht",
  type: "VTextField",
} as Field;

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { data, error } = await $fetch("/api/projects/add/git", {
    method: "POST",
    query: {
      path: cwd,
    },
    body: {
      url: values.url,
    },
  })
    .then((data) => ({ data: data, error: null }))
    .catch((e) => ({ data: null, error: e }));
  loading.value = false;
  if (!data || error) console.error(`error ${error || "error getting data"}`);
  emit("added");
  menuOpen.value = false;
});
</script>
