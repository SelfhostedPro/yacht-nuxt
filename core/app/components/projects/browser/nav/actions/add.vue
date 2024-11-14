<!-- eslint-disable vue/no-v-html -->
<template>
  <v-btn color="primary">
    <v-icon icon="mdi-plus" />
    <v-menu v-model="menuOpen" activator="parent" :close-on-content-click="false">
      <v-card>
        <v-list width="40vw">
          <v-list-item class="align-center">
            <v-row align="center">
              <v-col>
                <common-form-dynamic-string :validate-on-mount="false" block dense :field="urlField"
                  :hint="`will clone to ${cwd}`" @keyup.enter="onSubmit" />
              </v-col>
              <v-col cols="3">
                <v-btn :loading="loading" class="mt-1" variant="plain" :rounded="0" append-icon="mdi-magnify"
                  text="check" @click="onSubmit" />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-auto-animate>
                <span v-for="error, _, i in errors" :key="i" class="text-error" v-html="error" />
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
import type { Field } from "#core/types/forms";
const loading = ref(false);
const menuOpen = ref(false);
const emit = defineEmits(["added"]);
const { cwd } = defineProps<{ cwd: string }>();

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(z.object({ url: string().url() })),
});

const urlField: Field = {
  name: "url",
  label: "url",
  value: "url",
  placeholder: "https://github.com/selfhostedpro/yacht",
  type: "input",
}

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
